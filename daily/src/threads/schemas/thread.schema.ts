import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ProductDocument } from '../../products/schemas';
import { SCHEMA } from '../../common/mock';
import { UserDocument } from '../../users/schemas';
import { Base } from '../../common/schemas';

export type ThreadDocument = Thread & Document;
@Schema()
export class Thread extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.PRODUCT,
  })
  product: ProductDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  userOne: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  userTwo: UserDocument;

  @Prop({ default: false })
  isUserOneRead: boolean;

  @Prop({ default: false })
  isUserTwoRead: boolean;

  @Prop({ default: false })
  isUserOneOnline: boolean;

  @Prop({ default: false })
  isUserTwoOnline: boolean;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);

ThreadSchema.virtual('chats', {
  ref: SCHEMA.CHAT,
  localField: '_id',
  foreignField: 'thread',
});

ThreadSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      product: ret.product,
      userOne: ret.userOne,
      userTwo: ret.userTwo,
      chats: ret.chats,
      isUserOneRead: ret.isUserOneRead,
      isUserTwoRead: ret.isUserTwoRead,
      isUserOneOnline: ret.isUserOneOnline,
      isUserTwoOnline: ret.isUserTwoOnline,
      isDeleted: ret.isDeleted,
      cTime: ret.cTime,
      cBy: ret.cBy,
      uTime: ret.uTime,
      uBy: ret.uBy,
    };
  },
});
