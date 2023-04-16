import { UserEntity } from './entities/user.entity';

export interface UserRepositoryInterface {
  create(data: UserEntity): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity | null>;
}
