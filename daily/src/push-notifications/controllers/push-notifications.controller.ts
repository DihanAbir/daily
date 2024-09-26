import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PushNotificationDto } from '../dto';
import { PushNotificationsService } from '../services';

@ApiTags('Notification')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('push-notifications')
export class PushNotificationsController {
  constructor(
    private readonly service: PushNotificationsService,
  ) {}

  @Post('send')
  public send(@Body() pushNotificationDto: PushNotificationDto) {
    return this.service.send(pushNotificationDto);
  }
}

