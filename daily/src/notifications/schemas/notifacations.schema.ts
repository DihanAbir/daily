import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { SCHEMA } from '../../common/mock';
import { ProductDocument } from '../../products/schemas';
import { UserDocument } from '../../users/schemas';
import { Base } from '../../common/schemas';
import { RentDocument } from '../../rents/schemas';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
  })
  sender: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  receiver: UserDocument;

  // Generally not necessary. However, we keep this field if it will require in the future
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.PRODUCT,
  })
  product: ProductDocument;

  // Generally not necessary. However, we keep this field if it will require in the future
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.RENT,
  })
  rent: RentDocument;

  @Prop()
  subject: string;

  @Prop()
  text: string;

  @Prop()
  activityType: string;

  @Prop()
  activityName: string;

  @Prop({
    type: SchemaTypes.Mixed,
  })
  actionInfo: Record<string, unknown>;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
