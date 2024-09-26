import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

const PORT = process.env.PORT || 8080

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase payload size limit to 50MB
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const options = {
    origin: [/^(.*)/, process.env.FE_HOST],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,traceparent,request-id,request-context,user-agent',
    exposedHeaders: 'X-DAYIRI-KEY,X-DAYIRI-KEY-EXPIRES',
  };

  const config = new DocumentBuilder()
    .setTitle('DAYIRI Api')
    .setDescription('This api will help clients to store their data.')
    .setVersion('1.0')
    .addTag('DAYIRI')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('swagger', app, document);

  // app.use(helmet());
  // app.use(cookieParser());
  // app.use(
  //   compression({
  //     level: 6,
  //     filter: shouldCompress,
  //   }),
  // );

  app.enableCors(options);
  await app.listen(PORT);
  Logger.log(`Origin customer_host:${process.env.FE_HOST}: ${process.env.PORT}`, 'OriginHost');

}
bootstrap();