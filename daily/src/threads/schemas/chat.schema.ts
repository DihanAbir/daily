import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ThreadDocument } from './thread.schema';
import { Base, MediaDocument, MediaSchema } from '../../common/schemas';
import { decodeToken } from '../../common/utils/helper';
import { Logger } from '@nestjs/common';
import { SCHEMA } from '../../common/mock';
import { UserDocument } from '../../users/schemas';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.THREAD,
    required: true,
  })
  thread: ThreadDocument;

  @Prop()
  message: string;

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  files: MediaDocument[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
  })
  sender: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
  })
  receiver: UserDocument;

  @Prop({ default: false }) // receiver read
  isRead: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.post('find', (docs, next) => {
  const password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';
  Promise.all(
    docs.map(async (doc) => {
      try {
        doc.message = await decodeToken(doc.message, password);
      } catch (err) {
        Logger.error(
          'Chat message decoding error: ',
          JSON.stringify(err),
          'EncodeDecodeException',
        );
        doc.message = undefined;
      }
      return doc;
    }),
  ).then(() => {
    next();
  });
});
