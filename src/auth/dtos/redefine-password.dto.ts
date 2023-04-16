import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RedefinePassword {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
