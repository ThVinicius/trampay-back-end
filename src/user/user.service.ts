import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserRepository } from 'src/databases/prisma/repositories/users.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async create(data: Omit<User, 'id' | 'createdAt'>) {
    const encryptedPassword = this.bcryptPassword(data.password);

    data.password = encryptedPassword;

    return await this.repository.create(data);
  }

  private bcryptPassword(password: string) {
    const saltRounds = 10;

    return bcrypt.hashSync(password, saltRounds);
  }
}
