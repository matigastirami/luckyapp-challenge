import { Controller, Request, Post, UseGuards, HttpCode } from '@nestjs/common';

import { AuthService } from './auth.service';
import LocalRestAuthGuard from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalRestAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user.user);
  }
}
