import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Base } from '../../common/schemas';
import { SCHEMA } from '../../common/mock';
import { CategoryDocument } from '../../categories/schemas';

export type SizeDocument = Size & Document;

@Schema({
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
})
export class Size extends Base {
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: SCHEMA.CATEGORY,
        required: true,
    })
    category: CategoryDocument;

    @Prop({ required: true })
    region: string;

    @Prop({ required: true })
    size: string;

    @Prop()
    description: string;
}

export const SizeSchema = SchemaFactory.createForClass(Size);

SizeSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        return {
            _id: ret._id,
            category: ret.category,
            region: ret.region,
            size: ret.size,
            description: ret.description,
            isActive: ret.isActive,
        };
    },
});
