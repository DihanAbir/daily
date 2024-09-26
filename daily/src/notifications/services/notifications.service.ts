import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	CreateNotificationDto,
	UpdateNotificationDto,
	NotificationDto,
} from '../dto';
import { Server } from 'socket.io';
import { INotification, INotificationWithCount } from '../interfaces';
import { IUser } from '../../users/interfaces/user.interface';
import { SCHEMA } from 'src/common/mock';

@WebSocketGateway({ cors: true })
@Injectable()
export class NotificationsService {
	@WebSocketServer() server: Server;
	/**
	 * Constructor
	 * @param {Model<INotification>} model,
	 */
	constructor(
		@InjectModel(SCHEMA.NOTIFICATION)
		private readonly model,
	) { }

	/**
	 * Create Notification
	 * @param {CreateNotificationDto} data
	 * @returns {Promise<INotification>}
	 */
	async create(
		data: CreateNotificationDto,
	): Promise<INotification> {
		try {
			const response = await new this.model(data).save();
			const result = await this.model
				.findById(response._id)
				.populate({
					path: 'receiver',
					select: '_id email',
					populate: {
						path: 'profile',
						select: '_id firstName middleName lastName gender profilePic',
					},
				})
				.populate({
					path: 'sender',
					select: '_id email',
					populate: {
						path: 'profile',
						select: '_id firstName middleName lastName gender profilePic',
					},
				})
				.exec();

			const unreadCount = await this.model.count({
				receiver: data.receiver,
				isRead: false,
			});

			this.server.emit(`notification-${data.receiver}`, {
				notification: result,
				unreadCount: unreadCount,
			});
			return result;
		} catch (err) {
			throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * update Notification
	 * @Param {string} id
	 * @Body {UpdateNotificationDto} data
	 * @returns {Promise<INotification>}
	 */
	async update(id: string, data: UpdateNotificationDto) {
		try {
			const notification = await this.model.findOne({ _id: id });
			const body = new NotificationDto({
				...data,
				uTime: Date.now()
			});

			return await notification.set(body).save();
		} catch (err) {
			throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * update bulk Notification
	 * @Body {IUser} user
	 */
	async updateBulk(user: IUser) {
		try {
			return await this.model.updateMany(
				{
					receiver: user._id,
					isRead: false,
				},
				{ $set: { isRead: true } },
			);
		} catch (err) {
			throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * find all notifications
	 * @returns {Promise<INotificationWithCount>}
	 */
	async findAll(user: IUser, query): Promise<INotificationWithCount> {
		try {
			const searchQuery: any = {};

			searchQuery.receiver = user._id;

			if (query.hasOwnProperty('activityType')) {
				searchQuery.activityType = query.activityType;
			}

			const limit: number = (query && query.limit) || 10;
			const skip: number = (query && query.skip) || 0;

			const unreadCount = await this.model.count({
				receiver: user._id,
				isRead: false,
			});

			const notifications = await this.model
				.find(searchQuery)
				.populate({
					path: 'receiver',
					select: {
						_id: 1,
						email: 1,
					},
					populate: {
						path: 'profile',
						select: {
							_id: 1,
							firstName: 1,
							middleName: 1,
							lastName: 1,
							gender: 1,
							profilePic: 1,
						},
					},
				})
				.populate({
					path: 'sender',
					select: {
						_id: 1,
						email: 1,
					},
					populate: {
						path: 'profile',
						select: {
							_id: 1,
							firstName: 1,
							middleName: 1,
							lastName: 1,
							gender: 1,
							profilePic: 1,
						},
					},
				})
				.limit(limit)
				.skip(skip)
				.sort({ uTime: -1 })
				.exec();
			return {
				notifications: notifications,
				unreadCount: unreadCount,
			};
		} catch (err) {
			throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
		}
	}
}
