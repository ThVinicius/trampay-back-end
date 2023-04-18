export interface UserBalanceEntity {
  id?: number;
  user_id: number;
  document: string;
  balance: number;
  createdAt?: Date;
  deletedAt?: Date;
}
