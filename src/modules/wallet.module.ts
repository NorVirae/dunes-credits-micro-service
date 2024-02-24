import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app/app.controller';
import { AppService } from '../providers/app.service';
import { AuthController } from '../controllers/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import * as Joi from 'joi';
import { UserController } from 'src/controllers/user/user.controller';
import { UserService } from 'src/providers/user.service';
import { WalletController } from 'src/controllers/wallet/wallet.controller';
import { WalletService } from 'src/providers/wallet.service';

@Module({
  imports: [ConfigModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
