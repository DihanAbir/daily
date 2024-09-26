import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsController } from './controllers';
import { BrandsService } from './services';
import { SCHEMA } from '../common/mock';
import { BrandSchema } from './schemas';
import {
  FilesService,
  LocalStorageService,
  AwsS3Service,
  DOSpaceService,
} from '../files/services';
import { DOSpaceServicerPovider } from '../files/helper/do-space.helper';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.BRAND, schema: BrandSchema },
    ]),
  ],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerPovider
  ]
})
export class BrandsModule {}
