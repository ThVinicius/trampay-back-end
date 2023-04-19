import { Test, TestingModule } from '@nestjs/testing';
import { UserBalanceService } from './user-balance.service';
import { UserBalanceRepository } from 'src/databases/prisma/repositories/user-balance.repository';

describe('UserBalanceService', () => {
  let service: UserBalanceService;

  const userBalanceRepositoryMock = {
    create: jest.fn(),
    updateDeletedAtByCreatedAtAndUserIdAndDocuments: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBalanceService,
        { provide: UserBalanceRepository, useValue: userBalanceRepositoryMock }
      ]
    }).compile();

    service = module.get<UserBalanceService>(UserBalanceService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('handleCreate', () => {
    it('should create user balances from CSV file', async () => {
      const file = Buffer.from(
        'documento,saldo\n123456,100.00\n654321,200.00\n'
      );
      const userId = 1;
      const data = [
        { document: '123456', balance: 100.0, user_id: userId },
        { document: '654321', balance: 200.0, user_id: userId }
      ];
      const documents = ['123456', '654321'];

      jest.spyOn(service, 'csvToArray').mockResolvedValueOnce(data);

      userBalanceRepositoryMock.updateDeletedAtByCreatedAtAndUserIdAndDocuments.mockResolvedValueOnce(
        undefined
      );

      userBalanceRepositoryMock.create.mockResolvedValueOnce(data);

      const result = await service.handleCreate(file, userId);

      expect(result).toEqual(data);
      expect(service.csvToArray).toHaveBeenCalledWith(file);
      expect(
        userBalanceRepositoryMock.updateDeletedAtByCreatedAtAndUserIdAndDocuments
      ).toHaveBeenCalledWith(expect.any(Date), userId, documents);
      expect(userBalanceRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('create', () => {
    it('should create user balances', async () => {
      const data = [
        { document: '123456', balance: 100.0, user_id: 1 },
        { document: '654321', balance: 200.0, user_id: 1 }
      ];

      userBalanceRepositoryMock.create.mockResolvedValueOnce(data);

      const result = await service.create(data);

      expect(result).toEqual(data);
      expect(userBalanceRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('handleDeleteByDate', () => {
    it('should update deletedAt by createdAt, userId and documents', async () => {
      const userId = 1;
      const date = new Date();
      const documents = ['123456', '654321'];

      userBalanceRepositoryMock.updateDeletedAtByCreatedAtAndUserIdAndDocuments.mockResolvedValueOnce(
        undefined
      );

      await service.handleDeleteByDate(userId, date, documents);

      expect(
        userBalanceRepositoryMock.updateDeletedAtByCreatedAtAndUserIdAndDocuments
      ).toHaveBeenCalledWith(date, userId, documents);
    });
  });

  describe('csvToArray', () => {
    it('should convert CSV file to an array of user balances', async () => {
      const file = Buffer.from(
        'documento,saldo\n123456,100.00\n654321,200.00\n'
      );
      const expected = [
        { document: '123456', balance: 100.0 },
        { document: '654321', balance: 200.0 }
      ];

      const result = await service.csvToArray(file);

      expect(result).toEqual(expected);
    });
  });
});
