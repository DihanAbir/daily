import { OmitType } from '@nestjs/swagger';
import { INotification } from '../interfaces';
import { NotificationDto } from './notification.dto';

export class UpdateNotificationDto
    extends OmitType(NotificationDto, [
        'sender',
        'receiver',
        'product',
        'rent',
        'subject',
        'text',
        'activityType',
        'activityName',
        'actionInfo',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateNotificationDto> {
    constructor(data?: INotification) {
        super(data);
    }
}
