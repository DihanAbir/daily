import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../users/interfaces';
import { IStates, IState, ICountry } from '../interfaces';
import { 
  CreateStateDto,
  UpdateStateDto,
  SearchStateDto,
  StateDto
 } from '../dto';
import { createSearchQuery } from '../../common/utils/helper';
import { State } from 'country-state-city';
import { SCHEMA } from '../../common/mock';

/**
 * State Service
 */
@Injectable()
export class StateService {
  /**
   * Constructor
   * @param {Model<IState>} stateModel
   * @param {Model<ICountry>} countryModel
   */
  constructor(
    @InjectModel(SCHEMA.STATE)
    private readonly stateModel: Model<IState>,
    @InjectModel(SCHEMA.COUNTRY)
    private readonly countryModel: Model<ICountry>,
  ) {}

  /**
   * Create state
   * @param {IUser} user
   * @param {CreateStateDto} data
   * @returns {Promise<IState>}
   */
  async create(user: IUser, data: CreateStateDto): Promise<IState> {
    try {
      const state = await this.stateModel.findOne({
        name: data.name,
      });
      const stateDTO = new StateDto();
      if (!state) {
        // stateDTO.cBy = user._id;
        stateDTO.cBy = 'roomeyrahman@gmail.com';
        const setState = { ...data, ...stateDTO };
        const registerDoc = new this.stateModel(setState);
        return registerDoc.save();
      } else {
        if (state.isDeleted === true) {
          stateDTO.isDeleted = false;
          const setState = { ...data, ...stateDTO };
          return await state.set(setState).save();
        } else {
          return Promise.reject(new ConflictException('State already exist'));
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit state
   * @param {string} id
   * @param {UpdateStateDTO} data
   * @returns {Promise<IState>} mutated state data
   */
  async update(id: string, data: UpdateStateDto): Promise<IState> {
    try {
      const state = await this.stateModel.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!state) {
        return Promise.reject(new NotFoundException('Could not find state.'));
      }
      const stateDTO = new StateDto();
      const setState = { ...data, ...stateDTO };

      return await state.set(setState).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches states
   * @returns {Promise<IStates>}
   */
  async findAll(query: SearchStateDto): Promise<IStates> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      const cursor = this.stateModel.find(searchQuery).sort('name ASC');

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IStates = {
        data: await cursor
          .populate('cities')
          .populate('country')
          .limit(limit)
          .skip(skip),
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.stateModel.countDocuments(searchQuery),
          limit,
          skip,
        };
      }

      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * find state by stateId
   * @param {string} id
   * @returns {Promise<IState>}
   */
  async findOne(id: string): Promise<IState> {
    try {
      const state = await this.stateModel
        .findOne({ _id: id })
        .populate({
          path: 'cities',
        })
        .populate('country')
        .exec();
      if (!state) {
        return Promise.reject(new NotFoundException('Could not find state.'));
      }
      return state;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Bulk insert states
   * @param {IUser} user
   * @returns {Promise<IState[]>}
   */
  async bulkInsert(user: IUser) {
    try {
      const dataSources = State.getAllStates();
      for (let i = 0; i < dataSources.length; i += 1) {
        const country = await this.countryModel
          .findOne({
            iso2code: dataSources[i].countryCode,
            isActive: true
          })
          .select({ _id: 1 })
          .lean();
        if (!country) {
          continue;
        }
        const stateDTO = new CreateStateDto();
        stateDTO.name = dataSources[i].name;
        stateDTO.iso2code = dataSources[i].isoCode;
        stateDTO.lat = Number(dataSources[i].latitude);
        stateDTO.lng = Number(dataSources[i].longitude);
        stateDTO.country = country._id;
        await this.create(user, stateDTO);
      }
      return {
        data: {
          result: 'SUCCESS',
        },
      };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
