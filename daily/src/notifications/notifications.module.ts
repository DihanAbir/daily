import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './controllers';
import { NotificationsService } from './services';
import { NotificationSchema } from './schemas/notifacations.schema';
import { SCHEMA } from '../common/mock';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SCHEMA.NOTIFICATION, schema: NotificationSchema },
        ]),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService]
})
export class NotificationsModule { }
