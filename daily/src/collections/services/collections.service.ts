import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCollectionDto,
  SearchCollectionDto,
  CollectionDto,
  UpdateCollectionDto,
} from '../dto';
import { ICollections, ICollection } from '../interfaces';
import { IUser } from '../../users/interfaces';
import { SCHEMA } from '../../common/mock';
import { FilesService } from '../../files/services';
import { MediaDto } from '../../common/dto';
import {
  createSearchQuery,
  subDocUpdateWithObj,
} from '../../common/utils/helper';

@Injectable()
export class CollectionsService {
  /**
   * Constructor
   * @param {Model<ICollection>} model
   * @param {service<FilesService>} filesService
   */
  constructor(
    @InjectModel(SCHEMA.COLLECTION)
    private readonly model: Model<ICollection>,
    private readonly filesService: FilesService,
  ) {}

  private async uploadFile(files: {
    image: Express.Multer.File[];
  }): Promise<any> {
    const { mimetype } = files.image[0];
    const uploadRes = await this.filesService.upload(files.image[0]);
    const mediaDTO = new MediaDto();
    mediaDTO.uri = uploadRes.Location;
    mediaDTO.provider = uploadRes.provider;
    mediaDTO.mimetype = mimetype;
    return mediaDTO;
  }

  /**
   * Create collection
   * @param {IUser} user
   * @param {CreateCollectionDto} data
   * @returns {Promise<ICollection>}
   */
  async create(
    data: CreateCollectionDto,
    user: IUser,
    files?: {
      image: Express.Multer.File[];
    },
  ): Promise<ICollection> {
    try {
      const newObj = {
        ...data,
        cBy: user._id,
      };
      if (files) {
        if (files?.image) {
          const uploadedFiles = await this.uploadFile(files);
          newObj.image = uploadedFiles ?? undefined;
        }
      }
      const body = new CollectionDto(newObj);
      const registerDoc = new this.model(body);
      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Update collection
   * @param {IUser} user
   * @param {string} id
   * @param {UpdateCollectionDto} data
   * @returns {Promise<ICollection>}
   */
  async update(
    id: string,
    data: UpdateCollectionDto,
    user: IUser,
    files?: {
      image: Express.Multer.File[];
    },
  ): Promise<ICollection> {
    try {
      const record = await this.model.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!record) {
        return Promise.reject(
          new NotFoundException('Could not find collection.'),
        );
      }
      const body = new CollectionDto({
        ...data,
        uBy: user._id,
      });
      if (files) {
        if (files && files.image) {
          const mediaDTO = await this.uploadFile(files);
          const doc = record.get('image') || {};
          body.image = subDocUpdateWithObj(doc, mediaDTO);
        }
      }
      return await record.set(body).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find All collection
   * @param {SearchCollectionDto} query
   * @returns {Promise<ICollections>}
   */
  async findAll(query: SearchCollectionDto): Promise<ICollections> {
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

      const result: ICollections = {
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
   * Find one collection
   * @param {string} id
   * @returns {Promise<ICollection>}
   */
  async findOne(id: string): Promise<ICollection> {
    try {
      const res = await this.model.findOne({ _id: id });

      if (!res) {
        return Promise.reject(
          new NotFoundException('Could not find collection.'),
        );
      }
      return res;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * count collection
   * @returns {Promise<number>}
   */
  async count(query: SearchCollectionDto): Promise<number> {
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
