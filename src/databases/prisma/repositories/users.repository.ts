import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserRepositoryInterface } from 'src/user/user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  public async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
