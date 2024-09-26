import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocalizationDocument = Localization & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Localization {
  @Prop()
  en: string; // English

  @Prop()
  es: string; // Spanish

  @Prop()
  fr: string; // French

  @Prop()
  de: string; // German

  @Prop()
  it: string; // Italian

  @Prop()
  ja: string; // Japanese

  @Prop()
  ru: string; // Russian

  @Prop()
  pt: string; // Portuguese

  @Prop()
  bn: string; // Bangla

  @Prop()
  nl: string; // Dutch

  @Prop({ default: false })
  isDeleted: boolean;
}

export const LocalizationSchema = SchemaFactory.createForClass(Localization);
