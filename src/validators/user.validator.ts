import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../module/database/repositories/user.repository';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'UsernameTakenRule', async: true })
@Injectable()
export class UsernameTakenRule implements ValidatorConstraintInterface {
  private readonly logger = new Logger(UsernameTakenRule.name);

  constructor(private readonly usersRepository: UserRepository) {}

  async validate(value: string) {
    try {
      const user = await this.usersRepository.getByUsername(value);
      if (user) {
        this.logger.warn(`Username ${value} is already taken`);
        return false;
      }
    } catch (e) {
      this.logger.error(
        `There was an error trying to fetch an user with username: ${value}`,
      );
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `User already exists`;
  }
}

export function isUserNameTaken(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UsernameTakenRule',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UsernameTakenRule,
    });
  };
}
