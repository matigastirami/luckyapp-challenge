import { Controller, Request, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import LocalRestAuthGuard from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalRestAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user.user);
  }
}
