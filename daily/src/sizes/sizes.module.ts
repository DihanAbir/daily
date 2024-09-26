import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { SizesController } from './controllers/sizes.controller';
import { SizesService } from './services/sizes.service';
import { SizeSchema } from './schemas';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.SIZE, schema: SizeSchema },
    ]),
  ],
  controllers: [SizesController],
  providers: [SizesService]
})
export class SizesModule { }
