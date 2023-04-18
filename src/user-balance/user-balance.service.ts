import { Injectable } from '@nestjs/common';
import { UserBalanceEntity } from './entities/user-balance.entity';
import { UserBalanceRepository } from 'src/databases/prisma/repositories/user-balance.repository';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { promisify } from 'util';

@Injectable()
export class UserBalanceService {
  constructor(private repository: UserBalanceRepository) {}

  async handleCreate(file: Express.Multer.File, userId: number) {
    const csvArray = await this.csvToArray(file);

    const data = csvArray.map(item => ({ ...item, user_id: userId }));

    const documents = data.map(userBalance => userBalance.document);

    await this.handleDeleteByDate(userId, new Date(), documents);

    return await this.create(data);
  }

  private async create(data: UserBalanceEntity[]) {
    return await this.repository.create(data);
  }

  private async handleDeleteByDate(
    userId: number,
    date: Date,
    documents: string[]
  ) {
    await this.repository.updateDeletedAtByCreatedAtAndUserIdAndDocuments(
      date,
      userId,
      documents
    );
  }

  private async csvToArray(file: Express.Multer.File) {
    const results: { documento: string; saldo: number }[] = [];

    const stream = Readable.from(file.buffer);

    stream.pipe(csv({ separator: ',' })).on('data', data => results.push(data));

    const endPromise = promisify(stream.on).call(stream, 'end');

    await endPromise;

    const groupValues: { document: string; balance: number }[] = Object.values(
      results.reduce((result, current) => {
        const saldo = Number(current.saldo);
        const document = current.documento;
        if (!result[document]) {
          result[document] = { document, balance: 0 };
        }
        result[document].balance += saldo;
        return result;
      }, {})
    );

    return groupValues;
  }
}
