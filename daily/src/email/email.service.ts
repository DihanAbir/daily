import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailContext } from '../common/mock';

@Injectable()
export class EmailService {
  /**
   * Constructor
   * @param {MailerService} mailerService
   */
  constructor(private mailerService: MailerService) {}

  /**
   * EmailService
   * @param {string} to
   * @param {string} subject
   * @param {string} template
   * @param {EmailContext} context
   * @returns {void}
   */
  sendEmail(
    to: string,
    subject: string,
    context: EmailContext,
    template: string,
  ): void {
    this.mailerService
      .sendMail({
        to: to,
        from: process.env.EMAIL_AUTH_USER,
        subject: subject,
        template: template,
        context: context,
      })
      .then((response) => {
        console.log('Email Success response: ', response);
      })
      .catch((err) => {
        console.error('Email Error response: ', err);
      });
  }
}
