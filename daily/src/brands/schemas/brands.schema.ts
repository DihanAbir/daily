import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '../../common/schemas';
import {
    MediaDocument,
    MediaSchema,
} from '../../common/schemas';

export type BrandDocument = Brand & Document;

@Schema({
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
})
export class Brand extends Base {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({
        type: MediaSchema,
    })
    image: MediaDocument;

    @Prop({
       default: false,
    })
    isApproved: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        return {
            _id: ret._id,
            name: ret.name,
            description: ret.description,
            image: ret.image,
            isActive: ret.isActive,
            isApproved: ret.isApproved
        };
    },
});
