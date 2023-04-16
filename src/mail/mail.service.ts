import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserSetPassword(user: UserEntity, token: string) {
    const url = `${process.env.FRONT_END_BASE_URL}/auth/set-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Desafio Trampay! Mudança de senha',
      template: './set-password',
      context: {
        url
      }
    });
  }
}
