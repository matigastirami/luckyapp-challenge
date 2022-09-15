import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DtoValidationPipe } from '../../validators/input-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IGetUserResponse } from '../database/repositories/user.repository';
import { UserId } from '../../decorator/user.decorator';
import { CreateUserDTO } from '../../dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body(new DtoValidationPipe()) createUserDto: CreateUserDTO,
  ) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  async getUser(@UserId() id: number): Promise<IGetUserResponse> {
    return this.userService.getUser(id);
  }
}
