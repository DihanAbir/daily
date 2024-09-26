import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/schemas';
import {
    LocationDocument,
    LocationSchema,
} from '../../common/schemas';
import { SCHEMA, DeliveryMethod } from '../../common/mock';
import { Base } from '../../common/schemas';
import { ProductDocument } from 'src/products/schemas';

export type RentDocument = Rent & Document;

@Schema({
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
})
export class Rent extends Base {
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: SCHEMA.PRODUCT,
        required: true,
    })
    product: ProductDocument;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: SCHEMA.USER,
        required: true,
    })
    owner: UserDocument;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: SCHEMA.USER,
        required: true,
    })
    customer: UserDocument;

    @Prop({
        type: LocationSchema,
    })
    location: LocationDocument;

    @Prop()
    rentFromDate: number;

    @Prop()
    rentToDate: number;

    @Prop()
    price: number;

    @Prop({
        type: SchemaTypes.Mixed, // Define as Mixed type for JSON object
    })
    priceBreakdown: Record<string, any>; // Define as Record<string, any> for JSON object

    @Prop()
    status: string;

    @Prop()
    paymentStatus: string;

    @Prop()
    notesForOwner: string;

    @Prop({
        enum: DeliveryMethod
    })
    deliveryMethod: string;  // POSTAGE, PICKUP
}

export const RentSchema = SchemaFactory.createForClass(Rent);

RentSchema.set('toJSON', {
    transform: function (doc, ret) {
        return {
            _id: ret._id,
            product: ret.product,
            owner: ret.owner,
            customer: ret.customer,
            location: ret.location,
            rentFromDate: ret.rentFromDate,
            rentToDate: ret.rentToDate,
            price: ret.price,
            priceBreakdown: ret.priceBreakdown,
            status: ret.status,
            paymentStatus: ret.paymentStatus,
            notesForOwner: ret.notesForOwner,
            deliveryMethod: ret.deliveryMethod,
            isActive: ret.isActive,
            isDeleted: ret.isDeleted,
        };
    },
});
