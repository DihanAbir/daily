import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/schemas';
import { MediaDocument, MediaSchema } from '../../common/schemas';
import { AvaibilityStatus, SCHEMA } from '../../common/mock';
import { Base } from '../../common/schemas';
import { CategoryDocument } from '../../categories/schemas';
import { SizeDocument } from '../../sizes/schemas';
import { ColorDocument } from '../../colors/schemas';
import { BrandDocument } from '../../brands/schemas';
import { CollectionDocument } from '../../collections/schemas';
import { IFavourite } from 'src/favourites/interfaces';

export type ProductDocument = Product &
  Document & {
    _doc: any; // To access the internal document
    favourites: IFavourite[];
  };

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Product extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  owner: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.CATEGORY,
    required: true,
  })
  category: CategoryDocument;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: SCHEMA.COLLECTION,
    default: undefined,
  })
  collections: CollectionDocument[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.SIZE,
    required: true,
  })
  size: SizeDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.COLOR,
    required: true,
  })
  color: ColorDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.BRAND,
    required: true,
  })
  brand: BrandDocument;

  @Prop({
    minlength: 1,
    maxlength: 30,
    required: true,
  })
  title: string;

  @Prop({
    unique: true,
    minlength: 3,
    maxlength: 10,
  })
  slug: string;

  @Prop()
  description: string;

  @Prop({
    default: AvaibilityStatus.AVAILABLE,
  })
  status: string;

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  images: MediaDocument[];

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  videos: MediaDocument[];

  @Prop()
  retailPrice: number;

  @Prop()
  rentPerDayPrice: number;

  @Prop()
  minimalRentalPeriodInDays: number;

  @Prop()
  cleaningPrice: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop()
  ratings: number;

  @Prop()
  postage: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('favourites', {
  ref: SCHEMA.FAVOURITE,
  localField: '_id',
  foreignField: 'product',
});

ProductSchema.virtual('isFavourite').get(function (this: ProductDocument) {
  if (this.favourites && this._doc.currentUser) {
    return this.favourites.some(
      (fav) => fav.user.toString() === this._doc.currentUser,
    );
  }
  return this._doc.isFavourite || false;
});

ProductSchema.virtual('favId').get(function (this: ProductDocument) {
  return this._doc.favId || '';
});

ProductSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      favourites: ret.favourites,
      isFavourite: ret.isFavourite,
      favId: ret.favId,
      owner: ret.owner,
      category: ret.category,
      collections: ret.collections,
      size: ret.size,
      color: ret.color,
      brand: ret.brand,
      title: ret.title,
      slug: ret.slug,
      description: ret.description,
      status: ret.status,
      images: ret.images,
      videos: ret.videos,
      retailPrice: ret.retailPrice,
      rentPerDayPrice: ret.rentPerDayPrice,
      minimalRentalPeriodInDays: ret.minimalRentalPeriodInDays,
      cleaningPrice: ret.cleaningPrice,
      viewCount: ret.viewCount,
      ratings: ret.ratings,
      postage: ret.postage,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
      cTime: ret.cTime,
    };
  },
});
