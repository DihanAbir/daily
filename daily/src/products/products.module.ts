import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { ProductsController } from './controllers';
import { ProductsService } from './services';
import { ProductSchema } from './schemas';
import {
  FilesService,
  LocalStorageService,
  AwsS3Service,
  DOSpaceService,
} from '../files/services';
import { DOSpaceServicerPovider } from '../files/helper/do-space.helper';
import { FavouriteSchema } from '../favourites/schemas/favourites.schema';
import { ReviewSchema } from '../reviews/schemas';
import { ReviewsService } from '../reviews/services/reviews.service';
import { NotificationSchema } from '../notifications/schemas/notifacations.schema';
import { NotificationsService } from '../notifications/services';
import { PushNotificationsService } from '../push-notifications/services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.PRODUCT, schema: ProductSchema },
      { name: SCHEMA.FAVOURITE, schema: FavouriteSchema },
      { name: SCHEMA.REVIEW, schema: ReviewSchema },
      { name: SCHEMA.NOTIFICATION, schema: NotificationSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ReviewsService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerPovider,
    NotificationsService,
    PushNotificationsService
  ],
})
export class ProductsModule {}
