import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('api')
export class UserController {
  constructor(private service: UserService) {}

  @IsPublic()
  @Post('sign-up')
  async create(@Body() body: CreateUserDto) {
    const { email: emailDto, password } = body;

    const { id, email, createdAt } = await this.service.create({
      email: emailDto,
      password
    });

    return { id, email, createdAt };
  }
}
