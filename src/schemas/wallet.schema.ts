import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Wallet>;

@Schema()
export class Wallet {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: number;

  @Prop()
  passwordHash: string;

  @Prop({ default: 1000 })
  creditBalance: number;
}

export const CatSchema = SchemaFactory.createForClass(Wallet);
