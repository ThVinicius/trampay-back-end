import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('api')
export class UserController {
  constructor(private service: UserService) {}

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
