import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from 'src/databases/prisma/repositories/user.repository';

describe('UserService', () => {
  let service: UserService;

  const userRepositoryMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    setPassword: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user when a valid email is provided', async () => {
      const user = { id: 1, email: 'john@example.com' };
      userRepositoryMock.findByEmail.mockReturnValueOnce(user);
      const result = await service.findByEmail('john@example.com');
      expect(userRepositoryMock.findByEmail).toBeCalledWith('john@example.com');
      expect(result).toEqual(user);
    });
  });

  describe('setPassword', () => {
    it('should call the repository method with the correct parameters', async () => {
      const email = 'john@example.com';
      const newPassword = 'newpassword';

      await service.setPassword(email, newPassword);

      expect(userRepositoryMock.setPassword).toBeCalledWith(email, newPassword);
    });
  });

  describe('create', () => {
    it('should call bcryptPassword and repository method with the correct parameters', async () => {
      const user = { email: 'john@example.com', password: 'password' };
      const encryptedPassword = 'encryptedPassword';
      const createdUser = { ...user, password: encryptedPassword };

      jest
        .spyOn(service, 'bcryptPassword')
        .mockReturnValueOnce(encryptedPassword);

      userRepositoryMock.create.mockResolvedValueOnce(createdUser);

      const result = await service.create(user);

      expect(service.bcryptPassword).toBeCalled();
      expect(userRepositoryMock.create).toBeCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });
});
