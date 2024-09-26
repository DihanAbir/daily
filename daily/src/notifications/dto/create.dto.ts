import { OmitType } from '@nestjs/swagger';
import { INotification } from '../interfaces';
import { NotificationDto } from './notification.dto';

export class CreateNotificationDto
    extends OmitType(NotificationDto, [
        'isRead',
        'cBy',
        'uBy'
    ] as const)
    implements Readonly<CreateNotificationDto> {
    constructor(data?: INotification) {
        super(data);
    }
}
