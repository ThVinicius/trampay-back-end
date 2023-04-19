import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { UnauthorizedError } from './errors/unauthorized.error';
import { NotFoundError } from './errors/not-found.error';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const jwtServiceMock = {
    sign: jest.fn()
  };

  const userServiceMock = {
    findByEmail: jest.fn(),
    setPassword: jest.fn(),
    bcryptPassword: jest.fn()
  };

  const mailServiceMock = {
    sendUserSetPassword: jest.fn()
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MailService, useValue: mailServiceMock }
      ]
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign the user in', async () => {
      const user = { id: 1, email: 'user@test.com', password: 'password' };

      const access_token = 'access_token';

      jwtServiceMock.sign.mockReturnValueOnce(access_token);

      const result = await authService.signIn(user);

      expect(jwtServiceMock.sign).toBeCalled();
      expect(result).toEqual({ access_token });
    });
  });

  describe('validateUser', () => {
    it('should return the user when the email and password are valid', async () => {
      const email = 'user@test.com';
      const password = 'password';
      const user = { id: 1, email, password: await bcrypt.hash(password, 10) };

      userServiceMock.findByEmail.mockReturnValueOnce(user);

      const result = await authService.validateUser(email, password);

      expect(userServiceMock.findByEmail).toBeCalledWith(email);
      expect(result).toEqual({ ...user, password: undefined });
    });

    it('should throw an UnauthorizedError when the email is invalid', async () => {
      const email = 'user@test.com';
      const password = 'password';

      userServiceMock.findByEmail.mockResolvedValueOnce(null);

      await expect(authService.validateUser(email, password)).rejects.toThrow(
        UnauthorizedError
      );

      expect(userServiceMock.findByEmail).toBeCalledWith(email);
    });

    it('should throw an UnauthorizedError when the password is invalid', async () => {
      const email = 'user@test.com';
      const password = 'password';
      const user = {
        id: 1,
        email,
        password: await bcrypt.hash('wrong_password', 10)
      };

      userServiceMock.findByEmail.mockResolvedValueOnce(user);

      await expect(authService.validateUser(email, password)).rejects.toThrow(
        UnauthorizedError
      );

      expect(userServiceMock.findByEmail).toBeCalledWith(email);
    });
  });

  describe('sendEmailToSetPassword', () => {
    it('should send an email to user to set password', async () => {
      const email = 'user@test.com';
      const user = { id: 1, email, password: 'password' };
      const access_token = 'access_token';

      userServiceMock.findByEmail.mockReturnValueOnce(user);

      jest.spyOn(authService, 'signIn').mockResolvedValueOnce({ access_token });
      mailServiceMock.sendUserSetPassword.mockResolvedValueOnce(undefined);

      await authService.sendEmailToSetPassword(email);

      expect(userServiceMock.findByEmail).toBeCalledWith(email);
      expect(authService.signIn).toBeCalledWith(user, { expiresIn: '10m' });
      expect(mailServiceMock.sendUserSetPassword).toBeCalledWith(
        user,
        access_token
      );
    });

    it('should throw a NotFoundError when the user does not exist', async () => {
      const email = 'nonexistent@test.com';

      userServiceMock.findByEmail.mockResolvedValueOnce(null);

      await expect(authService.sendEmailToSetPassword(email)).rejects.toThrow(
        NotFoundError
      );

      expect(userServiceMock.findByEmail).toBeCalledWith(email);
      expect(mailServiceMock.sendUserSetPassword).not.toBeCalled();
    });
  });

  describe('setPassword', () => {
    it('should set a new password to the user', async () => {
      const email = 'user@test.com';
      const newPassword = 'newpassword';
      const user = { id: 1, email, password: 'password' };

      userServiceMock.bcryptPassword.mockReturnValueOnce('encrypted_password');
      userServiceMock.setPassword.mockResolvedValueOnce({ id: user.id, email });

      const result = await authService.setPassword(email, newPassword);

      expect(userServiceMock.bcryptPassword).toBeCalledWith(newPassword);
      expect(userServiceMock.setPassword).toBeCalledWith(
        email,
        'encrypted_password'
      );
      expect(result).toEqual({ id: user.id, email });
    });
  });
});
