import { Module } from '@nestjs/common';
import { UserBalanceService } from './user-balance.service';
import { UserBalanceController } from './user-balance.controller';
import { UserBalanceRepository } from 'src/databases/prisma/repositories/user-balance.repository';
import { PrismaModule } from 'src/databases/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserBalanceRepository, UserBalanceService],
  controllers: [UserBalanceController]
})
export class UserBalanceModule {}
