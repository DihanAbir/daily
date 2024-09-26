import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Currency } from '../../common/mock/constant.mock';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({
    default: 0,
  })
  points: number;

  @Prop({
    default: 0,
  })
  balance: number;

  @Prop({
    default: Currency.USD,
  })
  currency: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
