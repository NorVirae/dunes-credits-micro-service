import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditsController } from 'src/controllers/credits/credits.controller';
import { Transaction, TransactionSchema } from 'src/models/transaction.model';
import { User, UserSchema } from 'src/models/user.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { CreditsService } from 'src/providers/services/credits.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [CreditsController],
  providers: [CreditsService, MessageHelper],
})
export class CreditsModule {}
