import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/schemas';
import { Base, MediaDocument, MediaSchema } from '../../common/schemas';
import { SCHEMA } from '../../common/mock';
import { ProductDocument } from '../../products/schemas';
import { RentDocument } from '../../rents/schemas';

export type ReviewDocument = Review & Document;

@Schema()
export class Review extends Base {
  @Prop({
    minlength: 3,
    maxlength: 150,
  })
  title: string;

  @Prop({
    unique: true,
    minlength: 3,
    maxlength: 10,
  })
  slug: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  reviewer: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.PRODUCT,
  })
  product: ProductDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.RENT,
    required: true,
  })
  rent: RentDocument;

  @Prop({
    minlength: 3,
    maxlength: 5000,
  })
  review: string;

  @Prop({
    minlength: 3,
    maxlength: 5000,
  })
  reply: string;

  @Prop()
  ratings: number;

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  pictures: MediaDocument[];

  @Prop()
  helpfulCount: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ reviewer: 1, rent: 1 }, { unique: true });
