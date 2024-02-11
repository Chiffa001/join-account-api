import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async getAll() {
    return this.userService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Post('/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetAll() {
    await this.userService.resetAll();
    return;
  }
}
