import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateColorDto,
    SearchColorDto,
    ColorDto,
    UpdateColorDto,
} from '../dto';
import { IColors, IColor } from '../interfaces';
import { IUser } from '../../users/interfaces';
import { createSearchQuery } from '../../common/utils/helper';
import { SCHEMA } from '../../common/mock';

@Injectable()
export class ColorsService {
    /**
     * Constructor
     * @param {Model<IColor>} model
     */
    constructor(
        @InjectModel(SCHEMA.COLOR)
        private readonly model: Model<IColor>,
    ) { }

    /**
     * Create color
     * @param {CreateColorDto} data
     * @param {IUser} user     
     * @returns {Promise<IColor>}
     */
    async create(data: CreateColorDto, user: IUser,): Promise<IColor> {
        try {
            const body = new ColorDto({
                ...data,
                cBy: user._id
            });
            const registerDoc = new this.model(body);
            return await registerDoc.save();
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

    /**
     * Update color
     * @param {IUser} user
     * @param {string} id
     * @param {UpdateColorDto} data
     * @returns {Promise<IColor>}
     */
    async update(
        id: string,
        data: UpdateColorDto,
        user: IUser,
    ): Promise<IColor> {
        try {
            const record = await this.model.findOne({
                _id: id,
                isDeleted: false,
            });
            if (!record) {
                return Promise.reject(new NotFoundException('Could not find color.'));
            }
            const body = new ColorDto({
                ...data,
                uBy: user._id
            });
            return await record.set(body).save();
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

    /**
     * Find All color
     * @param {SearchColorDto} query
     * @returns {Promise<IColors>}
     */
    async findAll(query: SearchColorDto): Promise<IColors> {
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

            const result: IColors = {
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
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }


    /**
     * Find one color
     * @param {string} id
     * @returns {Promise<IColor>}
     */
    async findOne(id: string): Promise<IColor> {
        try {
            const res = await this.model.findOne({ _id: id });

            if (!res) {
                return Promise.reject(new NotFoundException('Could not find color.'));
            }
            return res;
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

    /**
     * count color
     * @returns {Promise<number>}
     */
    async count(query: SearchColorDto): Promise<number> {
        try {
            const searchQuery = createSearchQuery(query);
            return await this.model.countDocuments(searchQuery);
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }
}

