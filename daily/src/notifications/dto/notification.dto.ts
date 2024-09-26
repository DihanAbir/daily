import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto';
import { INotification } from '../interfaces';

export class NotificationDto extends BaseDto implements Readonly<NotificationDto> {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  sender: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  receiver: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  product: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  rent: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  activityType: string;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  actionInfo: Record<string, unknown>;

  @ApiProperty({ default: false })
  isRead: boolean;

  constructor(data?: INotification) {
    super(data);
    if (data) {
        data.sender && (this.sender = data.sender);
        data.receiver && (this.receiver = data.receiver);
        data.product && (this.product = data.product);
        data.rent && (this.rent = data.rent);
        data.subject && (this.subject = data.subject);
        data.text && (this.text = data.text);
        data.activityType && (this.activityType = data.activityType);
        data.activityName && (this.activityName = data.activityName);
        data.actionInfo && (this.actionInfo = data.actionInfo);
        data.hasOwnProperty('isRead') && (this.isRead = data.isRead)
    }
}
}
