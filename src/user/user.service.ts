import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from 'src/databases/prisma/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async create(data: UserEntity) {
    const encryptedPassword = this.bcryptPassword(data.password);

    data.password = encryptedPassword;

    return await this.repository.create(data);
  }

  async findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async setPassword(email: string, newPassword: string) {
    return await this.repository.setPassword(email, newPassword);
  }

  bcryptPassword(password: string) {
    const saltRounds = 10;

    return bcrypt.hashSync(password, saltRounds);
  }
}
