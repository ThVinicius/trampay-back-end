import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate
} from 'class-validator';
import { PasswordMatchConstraint } from '../decorators/password-match.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, {
    message: 'O campo password não pode ser composto apenas por espaços vazios.'
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(PasswordMatchConstraint, ['password'])
  confirmPassword: string;
}
