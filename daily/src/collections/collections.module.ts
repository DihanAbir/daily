import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { CollectionsController } from './controllers';
import { CollectionsService } from './services';
import { CollectionSchema } from './schemas';
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
      { name: SCHEMA.COLLECTION, schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [
    CollectionsService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerPovider
  ]
})
export class CollectionsModule {}
