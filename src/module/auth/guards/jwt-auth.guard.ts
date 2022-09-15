import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request] = context.getArgs();

    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = this.jwtService.decode(authorization) as any;

      if (!decoded) {
        return false;
      }

      request.user = decoded;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
