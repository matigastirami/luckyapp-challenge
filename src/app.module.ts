import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CacheModule.register({
      store: redisStore,
      isGlobal: true,
      host: 'redis',
      port: 6379,
      ttl: 30
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
