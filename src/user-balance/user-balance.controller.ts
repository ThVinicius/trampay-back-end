import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserBalanceService } from './user-balance.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('api')
export class UserBalanceController {
  constructor(private service: UserBalanceService) {}

  @Post('user-balance')
  @UseInterceptors(FileInterceptor('csv'))
  async uploadCSV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })]
      })
    )
    file: Express.Multer.File,
    @CurrentUser() user: UserEntity
  ) {
    return await this.service.handleCreate(file, user.id);
  }
}
