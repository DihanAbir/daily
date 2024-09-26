import { Injectable, Logger } from '@nestjs/common';
import * as fcmAdmin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { serviceAccount } from './secret';
import { PushNotificationDto } from '../dto';

fcmAdmin.initializeApp({
  credential: fcmAdmin.credential.cert(serviceAccount as ServiceAccount), // Path to your service account JSON file
});

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  async send(data: PushNotificationDto) {
    const { title, body, token } = data;
    const payload = {
      notification: {
        title,
        body,
        sound: 'default',
      }
    };
    this.logger.log('Notification is send');
    Promise.all([await fcmAdmin.messaging().sendToDevice(token, payload)]);
  }
}

