import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMA } from '../../common/mock';
import { IReview, IReviews } from '../interfaces';
import { Model } from 'mongoose';
import {
  CreateReviewDto,
  ReviewDto,
  SearchReviewDto,
  UpdateReviewDto,
} from '../dto';
import { IUser } from '../../users/interfaces';
import { createSearchQuery, slug } from '../../common/utils/helper';
import { FilesService } from '../../files/services';

@Injectable()
export class ReviewsService {
  /**
   * Constructor
   * @param {Model<IReview>} model
   */
  constructor(
    @InjectModel(SCHEMA.REVIEW)
    private readonly model: Model<IReview>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Create record
   * @param {CreateReviewDto} data
   * @param {IUser} user
   * @returns {Promise<IReview>}
   */
  async create(data: CreateReviewDto, user: IUser): Promise<IReview> {
    try {
      let pictures: any = [];
      if (data && data.base64EncodedStrings) {
        pictures = await this.filesService.uploadBase64Files(
          data.base64EncodedStrings,
        );
      }
      const body = new ReviewDto({
        ...data,
        pictures: pictures.images,
        slug: slug(),
        reviewer: user._id,
        cBy: user._id,
      });
      const registerDoc = new this.model(body);
      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Update record
   * @param {IUser} user
   * @param {string} id
   * @param {UpdateReviewDto} data
   * @returns {Promise<IReview>}
   */
  async update(
    id: string,
    data: UpdateReviewDto,
    user: IUser,
  ): Promise<IReview> {
    try {
      const record = await this.model.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!record) {
        return Promise.reject(new NotFoundException('Could not find record.'));
      }
      let body = new ReviewDto();

      if (data?.hasOwnProperty('pictures')) {
        body.pictures = data.pictures;
      }

      body = {
        ...data,
        ...body,
        uBy: user._id,
      };
      return await record.set(body).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find All record
   * @param {SearchReviewDto} query
   * @returns {Promise<IReviews>}
   */
  async findAll(query: SearchReviewDto): Promise<IReviews> {
    try {
      console.log('query: ', query);
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;
      console.log(searchQuery);
      const cursor = !query.getAllRecord
        ? this.model.find(searchQuery).limit(limit).skip(skip)
        : this.model.find(searchQuery);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }
      cursor.populate([
        {
          path: 'reviewer',
          populate: {
            path: 'profile',
          },
        },
        {
          path: 'user',
          populate: {
            path: 'profile',
          },
        },
        {
          path: 'product',
        },
      ]);
      const result: IReviews = {
        data: await cursor.exec(),
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

  /**
   * Find one record
   * @param {string} id
   * @returns {Promise<IReview>}
   */
  async findOne(id: string): Promise<IReview> {
    try {
      const res = await this.model.findOne({ _id: id });

      if (!res) {
        return Promise.reject(new NotFoundException('Could not find record.'));
      }
      return res;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * count record
   * @returns {Promise<number>}
   */
  async count(query: SearchReviewDto): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);
      return await this.model.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
