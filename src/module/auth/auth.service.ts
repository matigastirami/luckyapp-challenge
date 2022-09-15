import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import Hash from '../../helper/hash';
import { JwtService } from '@nestjs/jwt';
import ServiceError from '../../helper/service-error';
import { ErrorType } from '../../helper/types';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.getByUsername(username);

    if (user && (await Hash.compare(pass, user.password))) {
      return { user };
    }

    throw new ServiceError(
      ErrorType.SERVICE,
      `Incorrect user and/or password`,
      'INVALID_CREDENTIALS',
      HttpStatus.BAD_REQUEST,
      [
        {
          issue: 'INVALID_CREDENTIALS',
          description: `Check the sent credentials`,
        },
      ],
    );
  }

  async login(user: any) {
    const payload = { ...user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
