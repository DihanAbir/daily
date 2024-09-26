import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '../../common/schemas';
import {
    MediaDocument,
    MediaSchema,
} from '../../common/schemas';

export type CollectionDocument = Collection & Document;

@Schema({
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
})
export class Collection extends Base {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({
        type: MediaSchema,
    })
    image: MediaDocument;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

CollectionSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        return {
            _id: ret._id,
            name: ret.name,
            image: ret.image,
            isActive: ret.isActive,
        };
    },
});
