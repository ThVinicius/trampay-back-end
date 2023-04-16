import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Request,
  UseGuards,
  Body
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { SetPasswordDto } from './dtos/set-password.dto';
import { RedefinePassword } from './dtos/redefine-password.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    return this.authService.signIn(req.user);
  }

  @IsPublic()
  @Post('redefine-password')
  async sendEmailToSetPassword(@Body() body: RedefinePassword) {
    await this.authService.sendEmailToSetPassword(body.email);
  }

  @Patch('set-password')
  async setPassword(
    @CurrentUser() currentUser: UserEntity,
    @Body() body: SetPasswordDto
  ) {
    return this.authService.setPassword(currentUser.email, body.password);
  }
}
