import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletController } from 'src/controllers/wallet/wallet.controller';
import { WalletService } from 'src/providers/services/wallet.service';

@Module({
  imports: [ConfigModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
