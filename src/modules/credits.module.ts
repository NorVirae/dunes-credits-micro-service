import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreditsController } from 'src/controllers/credits/credits.controller';
import { WalletService } from 'src/providers/services/credits.service';

@Module({
  imports: [ConfigModule],
  controllers: [CreditsController],
  providers: [WalletService],
})
export class WalletModule {}
