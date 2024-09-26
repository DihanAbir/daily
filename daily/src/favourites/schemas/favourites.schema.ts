import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/schemas';
import { SCHEMA } from '../../common/mock';
import { Base } from '../../common/schemas';
import { ProductDocument } from '../../products/schemas';

export type FavouriteDocument = Favourite & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Favourite extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.PRODUCT,
    required: true,
  })
  product: ProductDocument;

  @Prop({ default: true })
  isFavourite: boolean;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);

FavouriteSchema.index({ user: 1, product: 1 }, { unique: true });
