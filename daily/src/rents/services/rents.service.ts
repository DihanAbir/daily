import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRentDto, SearchRentDto, RentDto, UpdateRentDto } from '../dto';
import { IRents, IRent } from '../interfaces';
import { IUser } from '../../users/interfaces';
import { createSearchQuery } from '../../common/utils/helper';
import { SCHEMA } from '../../common/mock';
import { IProduct } from 'src/products/interfaces';
import {
  convertDayToMilliseconds,
  numberToDaysInWords,
} from 'src/helpers/timeHelper';
const dayjs = require('dayjs');

@Injectable()
export class RentsService {
  /**
   * Constructor
   * @param {Model<IRent>} model
   */
  constructor(
    @InjectModel(SCHEMA.RENT)
    private readonly model: Model<IRent>,
    @InjectModel(SCHEMA.PRODUCT)
    private readonly productModel: Model<IProduct>,
  ) {}

  /**
   * Create record
   * @param {CreateRentDto} data
   * @param {IUser} user
   * @returns {Promise<IRent>}
   */
  async create(data: CreateRentDto, user: IUser): Promise<IRent> {
    try {
      const existingRent = await this.model.findOne({ product: data.product });
      if (existingRent) {
        const isNewRentOverlapping =
          (data.rentFromDate >= existingRent.rentFromDate &&
            data.rentToDate <= existingRent.rentToDate) ||
          (data.rentFromDate <= existingRent.rentFromDate &&
            data.rentToDate >= existingRent.rentFromDate) ||
          (data.rentFromDate <= existingRent.rentToDate &&
            data.rentToDate >= existingRent.rentToDate);

        if (isNewRentOverlapping) {
          return Promise.reject(
            new BadRequestException(
              'You cannot rent this product since this product has already been rented between the selected time',
            ),
          );
        }
      }
      if (data.owner === user._id) {
        return Promise.reject(
          new BadRequestException(
            "Product owner can't be renting his own product",
          ),
        );
      }

      const product = await this.productModel.findOne({ _id: data.product });
      if (
        data.rentToDate - data.rentFromDate <
        convertDayToMilliseconds(product.minimalRentalPeriodInDays)
      ) {
        return Promise.reject(
          new BadRequestException(
            `To rent this product the rent date ranges should be more than ${numberToDaysInWords(
              product.minimalRentalPeriodInDays,
            )}`,
          ),
        );
      }
      if (!product) {
        return Promise.reject(
          new NotFoundException('Could not find any product.'),
        );
      } else {
        if (product.owner != data.owner) {
          return Promise.reject(
            new BadRequestException(
              "The owner you've selected is not the owner of this product",
            ),
          );
        }
      }

      const currentDate = dayjs();
      const daysUntilRentFrom = dayjs(data.rentFromDate).diff(
        currentDate,
        'day',
      );
      const daysUntilRentTo = dayjs(data.rentToDate).diff(currentDate, 'day');

      if (daysUntilRentFrom < 0 || daysUntilRentTo < 0) {
        return Promise.reject(
          new BadRequestException(
            'Rental dates must be after the current date',
          ),
        );
      }
      const body = new RentDto({
        ...data,
        customer: user._id,
        cBy: user._id,
      });
      const registerDoc = new this.model(body);
      const result = await registerDoc.save();
      return await this.model
        .findOne({ _id: result._id })
        .populate({
          path: 'customer',
          populate: {
            path: 'profile',
          },
        })
        .populate({
          path: 'owner',
          populate: {
            path: 'profile',
          },
        })
        .populate({
          path: 'product',
        });
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
   * @param {UpdateRentDto} data
   * @returns {Promise<IRent>}
   */
  async update(id: string, data: UpdateRentDto, user: IUser): Promise<IRent> {
    try {
      const record = await this.model.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!record) {
        return Promise.reject(new NotFoundException('Could not find record.'));
      }
      const body = new RentDto({
        ...data,
        uBy: user._id,
      });
      const result = await record.set(body).save();
      return await this.model
        .findOne({ _id: result._id })
        .populate({
          path: 'customer',
          populate: {
            path: 'profile',
          },
        })
        .populate({
          path: 'owner',
          populate: {
            path: 'profile',
          },
        })
        .populate({
          path: 'product',
        });
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find All record
   * @param {SearchRentDto} query
   * @returns {Promise<IRents>}
   */
  async findAll(query: SearchRentDto): Promise<IRents> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      const cursor = !query.getAllRecord
        ? this.model.find(searchQuery).limit(limit).skip(skip)
        : this.model.find(searchQuery);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }
      cursor.populate(['product']);
      cursor.populate({
        path: 'customer',
        populate: {
          path: 'profile',
        },
      });
      cursor.populate({
        path: 'owner',
        populate: {
          path: 'profile',
        },
      });
      const result: IRents = {
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
   * @returns {Promise<IRent>}
   */
  async findOne(id: string): Promise<IRent> {
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
  async count(query: SearchRentDto): Promise<number> {
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
