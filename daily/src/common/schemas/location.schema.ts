import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CountryDocument } from '../../demography/schemas/country.schema';
import { StateDocument } from '../../demography/schemas/state.schema';
import { CityDocument } from '../../demography/schemas/city.schema';
import { SCHEMA } from '../../common/mock';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({
    minlength: 2,
    maxlength: 300,
  })
  address: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.CITY,
  })
  city: CityDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.STATE,
  })
  state: StateDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.COUNTRY,
  })
  country: CountryDocument;

  @Prop()
  zipCode: string;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
