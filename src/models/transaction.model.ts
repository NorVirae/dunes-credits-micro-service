// transaction.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  senderEmail: string;

  @Prop({ required: true })
  receiverEmail: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  transactionFee: number;

  @Prop({ default: false })
  isSuccessful: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
