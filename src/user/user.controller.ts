import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IGetUserResponse } from 'src/database/repositories/user.repository';
import { UserId } from 'src/decorator/user.decorator';
import { CreateUserDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  async getUser(@UserId() id: number): Promise<IGetUserResponse> {
    return this.userService.getUser(id);
  }
}
