import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CountryDocument } from './country.schema';
import { SCHEMA } from '../../common/mock';
import { Base } from '../../common/schemas';

export type StateDocument = State & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class State extends Base {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  iso2code: string;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.COUNTRY,
    required: true,
  })
  country: CountryDocument;

  @Prop({ default: false })
  isCapital: boolean;
}

export const StateSchema = SchemaFactory.createForClass(State);

StateSchema.index({ name: 1, country: 1 }, { unique: true });

StateSchema.virtual('cities', {
  ref: SCHEMA.CITY,
  localField: '_id',
  foreignField: 'state',
  options: { sort: { name: 1 } },
  match: { isActive: true, isDeleted: false },
});

StateSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      name: ret.name,
      iso2code: ret.iso2code,
      lat: ret.lat,
      lng: ret.lng,
      cities: ret.cities,
      country: ret.country,
      isCapital: ret.isCapital,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
    };
  },
});
