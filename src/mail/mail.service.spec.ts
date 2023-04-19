import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/user/entities/user.entity';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  describe('sendUserSetPassword', () => {
    it('should send set password email to user', async () => {
      const user: UserEntity = { email: 'test@example.com' } as UserEntity;
      const token = 'token';

      await service.sendUserSetPassword(user, token);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: user.email,
        subject: 'Desafio Trampay! Mudança de senha',
        template: './set-password',
        context: {
          url: `${process.env.FRONT_END_BASE_URL}/auth/set-password?token=${token}`
        }
      });
    });
  });
});
