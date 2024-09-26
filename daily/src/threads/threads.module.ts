import { Module } from '@nestjs/common';
import { ThreadsController } from './controllers';
import { ThreadsService, ChatsService } from './services';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { ChatSchema, ThreadSchema } from './schemas';
import { UserSchema } from '../users/schemas';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.THREAD, schema: ThreadSchema },
      { name: SCHEMA.CHAT, schema: ChatSchema },
      { name: SCHEMA.USER, schema: UserSchema },

    ]),
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService, ChatsService],
  exports: [ThreadsService, ChatsService],
})
export class ThreadsModule {}
