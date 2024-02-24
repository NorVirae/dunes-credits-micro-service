import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from 'src/controllers/user/user.controller';
import { UserService } from 'src/providers/services/user.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
