import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { UnauthorizedError } from './errors/unauthorized.error';
import { NotFoundError } from './errors/not-found.error';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: MailService
  ) {}

  async signIn(user: UserEntity): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) return { ...user, password: undefined };
    }

    throw new UnauthorizedError(
      'O endereço de e-mail ou a senha fornecidos estão incorretos.'
    );
  }

  async sendEmailToSetPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundError('Email não encontrado!');

    const { access_token } = await this.signIn(user);

    await this.emailService.sendUserSetPassword(user, access_token);
  }

  async setPassword(email: string, newPassword: string) {
    const encryptedPassword = this.userService.bcryptPassword(newPassword);

    const { id } = await this.userService.setPassword(email, encryptedPassword);

    return { id, email };
  }
}
