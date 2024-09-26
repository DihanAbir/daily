import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { CreateNotificationDto } from '../../notifications/dto';
import { ActivityName, ActivityType } from '../mock/constant.mock';
import { Model } from 'mongoose';
import { IProduct } from '../../products/interfaces';
import { SCHEMA } from '../mock';
import { PushNotificationsService } from '../../push-notifications/services';
import { PushNotificationDto } from 'src/push-notifications/dto';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
	constructor(
		@InjectModel(SCHEMA.PRODUCT)
		private readonly productModel: Model<IProduct>,
		private readonly notificationService: NotificationsService,
		private readonly pushNotificationService: PushNotificationsService
	) { }
	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		const req = context.switchToHttp().getRequest();
		const method = req.method;
		const body = req.body;
		const route = req.route.path;
		const hostname = req.get('origin');
		const feHost = hostname || process.env.FE_HOST || 'http://localhost:3000';
		const cNotificationDTO = new CreateNotificationDto();
		let actionInfo: any = {};

		let isProductActivating = false;
		if (route === '/products/:id' && method === 'PATCH') {
			const { id } = req.params || {};
			const sProfile = await this.productModel.findOne({ _id: id });
			if (body?.isActive && !sProfile?.isActive) {
				isProductActivating = true;
			}
		}

		return next.handle().pipe(
			tap(async (res) => {
				const result = res.hasOwnProperty('data') ? res.data : res;
				switch (route) {
					case '/products':
						if (method === 'POST') {
							cNotificationDTO.receiver = result?.owner;
							cNotificationDTO.product = result?._id;
							cNotificationDTO.activityName = ActivityName.PRODUCT;
							cNotificationDTO.activityType = ActivityType.CREATED;
						}
						break;
					case '/products/:id':
						if (method === 'PATCH') {
							if (isProductActivating && result?.isActive) {
								cNotificationDTO.receiver = result?.owner;
								cNotificationDTO.product = result?._id;
								cNotificationDTO.activityName = ActivityName.PRODUCT;
								cNotificationDTO.activityType = ActivityType.ACTIVE;
							} else {
								return;
							}
						}
						break;
					case '/rents':
						if (method === 'POST') {
							cNotificationDTO.sender = result.customer._id;
							cNotificationDTO.receiver = result.owner._id;
							cNotificationDTO.rent = result.rent;
							cNotificationDTO.activityName = ActivityName.RENT_REQUEST;
							cNotificationDTO.activityType = ActivityType.SEND;
							const pushNotificationData = new PushNotificationDto();
							if (result.owner.fcmToken) {
								pushNotificationData.token = result.owner.fcmToken;
								pushNotificationData.title = 'Someone is Interested in Renting Your Item!';
								pushNotificationData.body = `Great news! Someone wants to rent your item. Check the details and confirm the request now!`;
								this.pushNotificationService.send(pushNotificationData)
							}
						}
						break;
					case '/rents/:id':
						if (method === 'PATCH') {
							const activityType = result.status.toUpperCase();
							cNotificationDTO.rent = result.rent;
							cNotificationDTO.activityName = ActivityName.RENT_REQUEST;
							cNotificationDTO.activityType = activityType;
							cNotificationDTO.sender = result.owner._id;
							cNotificationDTO.receiver = result.customer._id;
							const pushNotificationData = new PushNotificationDto();
							if (result.customer.fcmToken) {
								pushNotificationData.token = result.customer.fcmToken;
								pushNotificationData.title = 'ental Update: Action Required!';
								pushNotificationData.body = `There's an update on your rental request. Check the details to see.`;
								this.pushNotificationService.send(pushNotificationData)
							}
						}
						break;
				}

				actionInfo = {
					status: 'SUCCESS',
					data: result || '',
					message: res.message || '',
				};

				cNotificationDTO.actionInfo = actionInfo;
				cNotificationDTO.cTime = result?.cTime || Date.now();
				cNotificationDTO.uTime = result?.uTime || Date.now();

				await this.notificationService.create(cNotificationDTO);
			}),
		);
	}
}
