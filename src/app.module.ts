import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';

const ENV_FILE_MAPPING = {
  development: '.env',
  test: '.env.test',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_FILE_MAPPING[process.env.NODE_ENV ?? 'development'],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        isGlobal: true,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('REDIS_DEFAULT_TTL'),
      }),
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
