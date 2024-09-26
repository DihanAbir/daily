import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { ColorsController } from './controllers/colors.controller';
import { ColorsService } from './services/colors.service';
import { ColorSchema } from './schemas';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.COLOR, schema: ColorSchema },
    ]),
  ],
  controllers: [ColorsController],
  providers: [ColorsService]
})
export class ColorsModule {}
