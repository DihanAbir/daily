import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CountryDocument } from './country.schema';
import { StateDocument } from './state.schema';
import { SCHEMA } from '../../common/mock';
import { Base } from '../../common/schemas';

export type CityDocument = City & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class City extends Base {
  @Prop({
    minlength: 1,
    maxlength: 80,
    required: true,
  })
  name: string;

  @Prop()
  areaCode: string;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.STATE,
    required: true,
  })
  state: StateDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.COUNTRY,
    required: true,
  })
  country: CountryDocument;

  @Prop({ default: false })
  isCapital: boolean;

  @Prop({ default: false })
  isStateCapital: boolean;
}

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.index({ name: 1, state: 1 }, { unique: true });

CitySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      name: ret.name,
      areaCode: ret.areaCode,
      lat: ret.lat,
      lng: ret.lng,
      state: ret.state,
      country: ret.country,
      isCapital: ret.isCapital,
      isStateCapital: ret.isStateCapital,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
    };
  },
});
