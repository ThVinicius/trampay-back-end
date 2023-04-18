import { UserBalanceEntity } from './entities/user-balance.entity';

export interface UserBalanceRepositoryInterface {
  create(balances: UserBalanceEntity[]): Promise<UserBalanceEntity[]>;

  updateDeletedAtByCreatedAtAndUserIdAndDocuments(
    date: Date,
    userId: number,
    documents: string[]
  ): Promise<void>;
}
