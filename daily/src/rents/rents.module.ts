import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { RentsController } from './controllers/rents.controller';
import { RentsService } from './services/rents.service';
import { RentSchema } from './schemas';
import { ProductSchema } from '../products/schemas';
import { ProductsModule } from '../products/products.module';
import { NotificationSchema } from '../notifications/schemas/notifacations.schema';
import { NotificationsService } from '../notifications/services';
import { PushNotificationsService } from '../push-notifications/services';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.RENT, schema: RentSchema },
      { name: SCHEMA.PRODUCT, schema: ProductSchema },
      { name: SCHEMA.NOTIFICATION, schema: NotificationSchema },
    ]),
    ProductsModule
  ],
  controllers: [RentsController],
  providers: [RentsService, NotificationsService, PushNotificationsService]
})
export class RentsModule { }
