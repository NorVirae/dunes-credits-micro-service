import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/controllers/auth/auth.guard';
import { UserController } from 'src/controllers/user/user.controller';
import { UserService } from 'src/providers/services/user.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [
    UserService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class UserModule {}
