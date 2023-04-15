import { User } from '@prisma/client';

export interface UserRepositoryInterface {
  create(data: Omit<User, 'id'>): Promise<User>;
}
