import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateSizeDto,
    SearchSizeDto,
    SizeDto,
    UpdateSizeDto,
} from '../dto';
import { ISizes, ISize } from '../interfaces';
import { IUser } from '../../users/interfaces';
import { createSearchQuery } from '../../common/utils/helper';
import { SCHEMA } from '../../common/mock';

@Injectable()
export class SizesService {
    /**
     * Constructor
     * @param {Model<ISize>} model
     */
    constructor(
        @InjectModel(SCHEMA.SIZE)
        private readonly model: Model<ISize>,
    ) { }

    /**
     * Create size
     * @param {CreateSizeDto} data
     * @param {IUser} user
     * @returns {Promise<ISize>}
     */
    async create(data: CreateSizeDto, user: IUser): Promise<ISize> {
        try {
            const body = new SizeDto({
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
     * Update size
     * @param {IUser} user
     * @param {string} id
     * @param {UpdateSizeDto} data
     * @returns {Promise<ISize>}
     */
    async update(
        id: string,
        data: UpdateSizeDto,
        user: IUser,
    ): Promise<ISize> {
        try {
            const record = await this.model.findOne({
                _id: id,
                isDeleted: false,
            });
            if (!record) {
                return Promise.reject(new NotFoundException('Could not find size.'));
            }
            const body = new SizeDto({
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
     * Find All size
     * @param {SearchSizeDto} query
     * @returns {Promise<ISizes>}
     */
    async findAll(query: SearchSizeDto): Promise<ISizes> {
        try {
            const searchQuery = createSearchQuery(query);
            const limit: number = (query && query.limit) || 10;
            const skip: number = (query && query.skip) || 0;

            const cursor = !query.getAllRecord
                ? this.model.find(searchQuery).limit(limit).skip(skip)
                : this.model.find(searchQuery);
            cursor.populate({
                path: 'category',
                select: {
                    name: 1,
                    image: 1
                }
            })
            if (query.hasOwnProperty('sort') && query.sort) {
                cursor.sort(JSON.parse(query.sort));
            }

            const result: ISizes = {
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
     * Find one size
     * @param {string} id
     * @returns {Promise<ISize>}
     */
    async findOne(id: string): Promise<ISize> {
        try {
            const res = await this.model.findOne({ _id: id });

            if (!res) {
                return Promise.reject(new NotFoundException('Could not find size.'));
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
     * count size
     * @returns {Promise<number>}
     */
    async count(query: SearchSizeDto): Promise<number> {
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


