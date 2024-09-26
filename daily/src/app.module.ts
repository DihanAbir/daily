import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters';
import { LoggingInterceptor, TransformInterceptor } from './common/interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'dotenv/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DemographyModule } from './demography/demography.module';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';
import { CollectionsModule } from './collections/collections.module';
import { BrandsModule } from './brands/brands.module';
import { SizesModule } from './sizes/sizes.module';
import { ColorsModule } from './colors/colors.module';
import { ProductsModule } from './products/products.module';
import { RentsModule } from './rents/rents.module';
import { ReplaceAuthorizationHeaderFromCookie } from './common/middlewares/replace-authorization-header';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { FavouritesModule } from './favourites/favourites.module';
import { OptionalAuthMiddleware } from './auth/middleware';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ThreadsModule } from './threads/threads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';

const DB_CONNECTION = process.env.DB_CONNECTION;

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        });
        return () => store;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(DB_CONNECTION, {
      autoIndex: true,
    }),
    EmailModule,
    UsersModule,
    AuthModule,
    DemographyModule,
    FilesModule,
    CategoriesModule,
    CollectionsModule,
    BrandsModule,
    SizesModule,
    ColorsModule,
    ProductsModule,
    RentsModule,
    FavouritesModule,
    ReviewsModule,
    ThreadsModule,
    NotificationsModule,
    PushNotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReplaceAuthorizationHeaderFromCookie).forRoutes('*');
    consumer
      .apply(OptionalAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
