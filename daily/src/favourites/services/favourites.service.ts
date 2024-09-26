import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFavourite } from '../interfaces';
import { IUser } from '../../users/interfaces/user.interface';
import {
  FavouriteDto,
  CreateFavouriteDto,
  UpdateFavouriteDto,
  SearchFavouriteDto,
} from '../dto';
import { SCHEMA } from '../../common/mock';
import { IProduct, IProducts } from '../../products/interfaces';
import { createSearchQuery, createSelectQuery } from 'src/common/utils/helper';
import { ProductsService } from 'src/products/services';

/**
 * Favourite Service
 */
@Injectable()
export class FavouritesService {
  /**
   * Constructor
   * @param {Model<IFavourite>} model
   */
  constructor(
    @InjectModel(SCHEMA.FAVOURITE)
    private readonly model: Model<IFavourite>,
    @InjectModel(SCHEMA.PRODUCT)
    private readonly productModel: Model<IProduct>,
  ) { }

  /**
   * Create favourite
   * @param {IUser} user
   * @param {CreateFavouriteDto} cFavDTO
   * @returns {Promise<IFavourite>}
   */
  create(data: CreateFavouriteDto, user: IUser): Promise<IFavourite> {
    try {
      const payload = new FavouriteDto({
        ...data,
        cBy: user._id,
        user: user._id,
      });
      const registerDoc = new this.model(payload);
      return registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit favourite
   * @param {string} id
   * @param {UpdateFavouriteDto} data
   * @param {IUser} user
   * @returns {Promise<IFavourite>} mutated favourite data
   */
  async update(
    id: string,
    data: UpdateFavouriteDto,
    user: IUser,
  ): Promise<IFavourite> {
    try {
      const favourite = await this.model.findOne({ _id: id });
      if (!favourite) {
        throw new NotFoundException('Could not find favourite.');
      }
      if (data && data.hasOwnProperty('user')) {
        throw new NotAcceptableException("User can't be modified");
      }
      if (data && data.hasOwnProperty('product')) {
        throw new NotAcceptableException("product can't be modified");
      }
      const payload = new FavouriteDto({
        ...data,
        uBy: user._id,
        uTime: Date.now(),
      });

      return await favourite.set(payload).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find All record
   * @param {SearchProductDto} query
   * @returns {Promise<IProducts>}
   */
  async findAll(query: SearchFavouriteDto, user?: IUser): Promise<IProducts> {
    try {
      const searchQuery = createSearchQuery(query);
      searchQuery.user = user._id;
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;
      
      const cursor = !query.getAllRecord
        ? this.model.find(searchQuery).limit(limit).skip(skip)
        : this.model.find(searchQuery);
      const favourites = await cursor
        .select({
          _id: 1,
          product: 1,
        })
        .exec();

      const productIds = favourites.map((fav) => {
        return fav.product;
      });
      const filter = {
        _id: {
          $in: productIds,
        },
      };
      const productCursor = this.productModel.find(filter);

      const populations = ['owner', 'category', 'brand', 'color', 'size', 'favourites'];

      if (query && query.select) {
        const { select, populationPathMap } = createSelectQuery(
          query,
          populations,
        );
        productCursor.select(select);
        Object.keys(populationPathMap).forEach((key) => {
          if (Object.keys(populationPathMap[key]['select']).length > 0)
            productCursor.populate(populationPathMap[key]);
        });
      } else {
        populations.map((item) => {
          productCursor.populate(item);
        });
      }

      if (query.hasOwnProperty('sort') && query.sort) {
        productCursor.sort(JSON.parse(query.sort));
      } else {
        productCursor.sort({ $natural: 1 });
      }

      let data: IProduct[] = await productCursor.exec();

      data.forEach((doc) => {
        doc['_doc'].isFavourite = true;
        const favourite = doc.favourites.find(fav => {
          if (String(fav.user) === String(user._id)) {
            return fav._id;
          }
        });
        doc['_doc'].favId = favourite._id;
      });

      const result: IProducts = {
        data,
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.model.countDocuments(searchQuery),
          limit,
          skip,
        };
      }
      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  async delete(id: string) {
    try {
      return this.model.deleteOne({
        _id: id,
      });
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
