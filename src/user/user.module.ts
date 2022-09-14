import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddressRepository } from 'src/database/repositories/address.repository';
import { CityRepository } from 'src/database/repositories/city.repository';
import { CountryRepository } from 'src/database/repositories/country.repository';
import { ProfileRepository } from 'src/database/repositories/profile.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import {
  DatabaseModule,
  databasePoolProvider,
} from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

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
  ],
  imports: [DatabaseModule],
})
export class UserModule {}
