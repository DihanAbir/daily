import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmailService } from '../../email/email.service';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../../users/interfaces';
import { SCHEMA } from '../mock';
//   import { IUser } from '../../user/interfaces';

@Injectable()
export class EmailInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(SCHEMA.USER)
    private readonly userModel: Model<IUser>,
    private readonly emailService: EmailService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const route = req.route.path;
    const hostname = req.get('origin');
    const feHost = hostname || process.env.FE_HOST || 'http://localhost:3000';
    return next.handle().pipe(
      tap(async (res) => {
        const result = res.hasOwnProperty('data') ? res.data : res;
        let recipient: string;
        let subject: string;
        let template = 'template';
        const context: any = {
          nameUser: result.email,
          hasActionButton: true,
        };

        switch (route) {
          case '/users':
            if (method === 'POST') {
              template = 'otp';
              recipient = result.email;
              subject = 'Verify Email Address';
              context.recipient = result.email.split('@')[0];
              context.otpVal = result.otp.toString().split('');

            }
            break;
          case '/users/verification':
            if (method === 'POST') {
              recipient = result.email;
              subject = 'Welcome To Dayiri!';
              context.title =
                'Your email address has successfully been verified!';
              context.description = `Congrats!
                We welcome you to Dayiri and look forward to growing
                together!`;
              // context.buttonText = 'LOG IN';
              // context.buttonUri = `${feHost}/signin`;
            }
            break;
            case '/users/verification/otp':
              if (method === 'POST') {
                recipient = result.email;
                subject = 'Welcome To Dayiri!';
                context.title =
                  'Your email address has successfully been verified!';
                context.description = `Congrats!
                  We welcome you to Dayiri and look forward to growing
                  together!`;
                // context.buttonText = 'LOG IN';
                // context.buttonUri = `${feHost}/signin`;
              }
              break;
          case '/users/generate/link':
            if (method === 'POST') {
              recipient = req.body.email;
              subject = 'Verification Completed';
              context.title = 'New Verification Email';
              context.description = `Please verify your email address to complete creating your account.`;
              context.buttonText = 'ACTIVATE';
              context.buttonUri = `${feHost}/verification?token=${recipient}`;
            }
            break;
          case '/users/reset-password/generate/link':
            if (method === 'POST') {
              const user = await this.userModel
                .findOne({ email: req.body.email })
                .lean()
                .exec();
              recipient = req.body.email;
              subject = 'Password Reset';
              context.title = 'Password Reset';
              context.description = `We got a request to reset your NestifyUSA Password. If you didn’t request a password request you can ignore this message and your password won’t be changed. You can also report to us for a suspicious password change attempt. Contact Us.`;
              context.buttonText = 'Reset Password';
              context.buttonUri = `${feHost}/reset-password?token=${user['passwordResetToken']}`;
            }
            break;
          case '/users/forget/password':
            if (method === 'PATCH') {
              recipient = result.email;
              subject = 'Password Reset';
              context.title = 'Password Reset';
              context.description = `Your have successfully changed your password`;
              context.buttonText = 'LOG IN';
              context.buttonUri = `${feHost}/signin`;
            }
            break;
          case '/users/reset/password':
            if (method === 'PATCH') {
              subject = 'Password Reset';
              recipient = result.email;
              context.title = 'Password Reset';
              context.description = `Your have successfully changed your password`;
              context.buttonText = 'LOG IN';
              context.buttonUri = `${feHost}/signin`;
            }
            break;
        }
        await this.emailService.sendEmail(
          recipient,
          subject,
          context,
          template,
        );
      }),
    );
  }
}
