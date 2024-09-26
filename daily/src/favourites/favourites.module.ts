import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { FavouritesController } from './controllers';
import { FavouritesService } from './services';
import { FavouriteSchema } from './schemas/favourites.schema';
import { ProductSchema } from '../products/schemas';
import { ProductsService } from '../products/services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.FAVOURITE, schema: FavouriteSchema },
      { name: SCHEMA.PRODUCT, schema: ProductSchema },
    ]),
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
