import { Module } from '@nestjs/common';
import { PushNotificationsController } from './controllers';
import { PushNotificationsService } from './services';

@Module({
  controllers: [PushNotificationsController],
  providers: [PushNotificationsService]
})
export class PushNotificationsModule {}
