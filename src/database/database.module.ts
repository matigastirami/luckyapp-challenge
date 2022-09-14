import { Logger } from '@nestjs/common';
import { OnApplicationShutdown } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';
import { AddressRepository } from './repositories/address.repository';
import { CityRepository } from './repositories/city.repository';
import { CountryRepository } from './repositories/country.repository';
import { ProfileRepository } from './repositories/profile.repository';
import { UserRepository } from './repositories/user.repository';

const databasePoolFactory = async (configService: ConfigService) => {
  return new Pool({
    user: configService.get('POSTGRES_USER'),
    host: configService.get('POSTGRES_HOST'),
    database: configService.get('POSTGRES_DB'),
    password: configService.get('POSTGRES_PASSWORD'),
    port: configService.get('POSTGRES_LOCAL_PORT'),
  });
};

export const databasePoolProvider = {
  provide: 'DATABASE_POOL',
  inject: [ConfigService],
  useFactory: databasePoolFactory,
};
@Module({
  providers: [
    databasePoolProvider,
    DatabaseService,
    UserRepository,
    AddressRepository,
    ProfileRepository,
    CityRepository,
    CountryRepository,
  ],
  exports: [DatabaseService, UserRepository],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Shutting down on signal ${signal}`);
    const pool = this.moduleRef.get('DATABASE_POOL') as Pool;
    return pool.end();
  }
}
