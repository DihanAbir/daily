import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(
        private readonly service: EmailService,
      ) {}
    
      @Post('send')
      public send(@Body() data) {
        return this.service.sendEmail(data.to, data.subject, data.context, 'template');
      }
}
