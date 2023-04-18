import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserBalanceRepositoryInterface } from 'src/user-balance/user-balance.repository.interface';
import { UserBalanceEntity } from 'src/user-balance/entities/user-balance.entity';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class UserBalanceRepository implements UserBalanceRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async create(balances: UserBalanceEntity[]): Promise<UserBalanceEntity[]> {
    return await this.prisma.$transaction(
      balances.map(data => this.prisma.userBalance.create({ data }))
    );
  }

  async updateDeletedAtByCreatedAtAndUserIdAndDocuments(
    date: Date,
    userId: number,
    documents: string[]
  ): Promise<void> {
    await this.prisma.userBalance.updateMany({
      where: {
        user_id: userId,
        createdAt: { gte: startOfDay(date), lte: endOfDay(date) },
        document: { in: documents }
      },
      data: { deletedAt: new Date() }
    });
  }
}
