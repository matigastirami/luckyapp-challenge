import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import ServiceError from '../../../helper/service-error';
import { ErrorType } from '../../../helper/types';
import { AuthService } from '../auth.service';

@Injectable()
export default class LocalRestAuthGuard extends AuthGuard('local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  private readonly logger = new Logger(LocalRestAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request] = context.getArgs();

    const { username, password } = request.body;

    if (!username || !password) {
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

    // TODO: this should validate the appId in case it's sent
    const userFromDb = await this.authService.validateUser(username, password);

    const isValid = !!userFromDb;

    if (!isValid) {
      this.logger.log(`User ${username} is not valid`);
      throw new UnauthorizedException();
    }

    request.user = userFromDb;

    return true;
  }
}
