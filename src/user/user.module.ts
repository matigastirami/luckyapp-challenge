import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseService } from '../database/database.service';
import { AddressRepository } from '../database/repositories/address.repository';
import { CityRepository } from '../database/repositories/city.repository';
import { CountryRepository } from '../database/repositories/country.repository';
import { ProfileRepository } from '../database/repositories/profile.repository';
import { UserRepository } from '../database/repositories/user.repository';
import {
  DatabaseModule,
  databasePoolProvider,
} from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsernameTakenRule } from '../validators/user.validator';

@Module({
  controllers: [UserController],
  providers: [
    databasePoolProvider,
    UserService,
    DatabaseService,
    UserRepository,
    ProfileRepository,
    AddressRepository,
    CityRepository,
    CountryRepository,
    UsernameTakenRule,
  ],
  imports: [DatabaseModule, AuthModule],
})
export class UserModule {}
