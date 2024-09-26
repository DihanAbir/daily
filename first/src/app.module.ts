import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import 'dotenv/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';


const DB_CONNECTION = process.env.DB_CONNECTION;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    MongooseModule.forRoot(DB_CONNECTION, {
      autoIndex: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    
  ],
})
export class AppModule {}
