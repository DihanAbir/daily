import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserProfile, IUserProfiles } from '../interfaces';
import {
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UserProfileDto,
  SearchUserProfileDto,
} from '../dto';
import {
  createSearchQuery,
  subDocUpdateWithArray,
  subDocUpdateWithObj,
} from '../../common/utils/helper';
import { FilesService } from '../../files/services';
import { MediaDto } from '../../common/dto';
import { SCHEMA } from '../../common/mock';
import { ApiGatewayTimeoutResponse } from '@nestjs/swagger';

@Injectable()
export class UserProfileService {
  /**
   * Constructor
   * @param {Model<IUserProfile>} model
   * @param {Model<IUser>} userModel
   * @param {service<FilesService>} filesService
   */
  constructor(
    @InjectModel(SCHEMA.USER_PROFILE)
    private readonly model: Model<IUserProfile>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Create a user profile
   * @param {IUser} user
   * @param {CreateUserProfileDto} createUserProfileDTO
   * @returns {Promise<IUserProfile>}
   */
  async create(data: CreateUserProfileDto, user: IUser): Promise<IUserProfile> {
    try {
      const userProfileDTO = new UserProfileDto({
        ...data,
        user: user._id,
        cBy: user._id,
      });
      userProfileDTO.user = user._id;
      userProfileDTO.cBy = user._id;
      const setUserProfile = { ...userProfileDTO, ...data };
      const registerDoc = await this.model.create(setUserProfile);
      return registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Edit profile data by user
   * @param {IUser} user
   * @param {UpdateUserProfileDTO} updateUserProfileDto
   * @param files
   * @returns {Promise<IUser>} mutated user data
   */
  async update(
    data: UpdateUserProfileDto,
    user: IUser,
    files?: {
      profilePic?: Express.Multer.File[];
      coverPic?: Express.Multer.File[];
    },
  ) {
    try {
      const userProfile = await this.model.findOne({
        user: user._id,
        isDeleted: false,
      });
      if (!userProfile) {
        return Promise.reject(new NotFoundException('User not found.'));
      }
      const profileDto = new UserProfileDto();

      if (files) {
        if (files && files.profilePic) {
          const { mimetype } = files.profilePic[0];
          const uploadRes = await this.filesService.upload(files.profilePic[0]);
          const mediaDTO = new MediaDto();
          mediaDTO.uri = uploadRes.Location;
          mediaDTO.provider = uploadRes.provider;
          mediaDTO.mimetype = mimetype;
          const profilePic = userProfile.get('profilePic') || {};
          profileDto.profilePic = subDocUpdateWithObj(profilePic, mediaDTO);
          if (userProfile.profilePercentage === 50) {
            profileDto.profilePercentage = 75;
          }
        }

        if (files && files.coverPic) {
          const { mimetype } = files.coverPic[0];
          const uploadRes = await this.filesService.upload(files.coverPic[0]);
          const mediaDTO = new MediaDto();
          mediaDTO.uri = uploadRes.Location;
          mediaDTO.provider = uploadRes.provider;
          mediaDTO.mimetype = mimetype;
          const coverPic = userProfile.get('coverPic') || {};
          profileDto.coverPic = subDocUpdateWithObj(coverPic, mediaDTO);
        }
      }

      if (data && data.hasOwnProperty('base64EncodedProfilePic')) {
        const proPic = await this.filesService.uploadBase64File(
          data.base64EncodedProfilePic,
        );
        const mediaDTO = new MediaDto();
        mediaDTO.uri = proPic.Location;
        mediaDTO.provider = proPic.provider;
        const profilePic = userProfile.get('profilePic') || {};
        profileDto.profilePic = subDocUpdateWithObj(profilePic, mediaDTO);
      } else if (data && data.hasOwnProperty('profilePic')) {
        const doc = userProfile.get('profilePic') || {};
        profileDto.profilePic = subDocUpdateWithObj(doc, data.profilePic);
      }

      if (data && data.hasOwnProperty('base64EncodedCoverPic')) {
        const base64CoverPic = await this.filesService.uploadBase64File(
          data.base64EncodedCoverPic,
        );
        const mediaDTO = new MediaDto();
        mediaDTO.uri = base64CoverPic.Location;
        mediaDTO.provider = base64CoverPic.provider;
        const coverPic = userProfile.get('coverPic') || {};
        profileDto.profilePic = subDocUpdateWithObj(coverPic, mediaDTO);
      }

      if (data && data.hasOwnProperty('mobile')) {
        const doc = userProfile.get('mobile') || {};
        profileDto.mobile = subDocUpdateWithObj(doc, data.mobile);
      }

      if (data && data.hasOwnProperty('location')) {
        const doc = userProfile.get('location') || {};
        profileDto.location = subDocUpdateWithObj(doc, data.location);
      }

      if (data && data.hasOwnProperty('socials')) {
        const docs = userProfile.get('socials') || [];
        profileDto.socials = subDocUpdateWithArray(docs, data.socials);
      }

      if (data && data.hasOwnProperty('coverPic')) {
        const doc = userProfile.get('coverPic') || {};
        profileDto.coverPic = subDocUpdateWithObj(doc, data.coverPic);
      }

      const setProfile = { ...data, ...profileDto };

      return await userProfile.set(setProfile).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * find user profile
   * @param {string} id
   * @param {string} slug
   * @param {string} userId
   * @returns {Promise<IUserProfile>}
   */
  async findOne(id?: string, userId?: string): Promise<IUserProfile> {
    try {
      const searchQuery: any = {};
      if (!id && !userId) {
        return Promise.reject(
          new BadRequestException('Either id or userId is required!'),
        );
      }
      if (id) searchQuery._id = id;
      if (userId) searchQuery.user = userId;
      return this.model
        .findOne(searchQuery)
        .populate({
          path: 'user',
          select: {
            email: 1,
            userPreference: 1,
            isActive: 1,
            isVerified: 1,
            isSuperAdmin: 1,
            isAdmin: 1,
          },
        })
        .populate([
          {
            path: 'location.city',
            select: {
              _id: 1,
              name: 1,
            },
          },
          {
            path: 'location.state',
            select: {
              _id: 1,
              name: 1,
            },
          },
          {
            path: 'location.country',
            select: {
              _id: 1,
              name: 1,
            },
          },
        ])
        .lean()
        .exec();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find All user profile
   * @returns {Promise<IUserProfiles>}
   */
  async findAll(query: SearchUserProfileDto): Promise<IUserProfiles> {
    try {
      let sortQuery: any = { $natural: -1 };
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      if (query.hasOwnProperty('sort') && query.sort) {
        sortQuery = JSON.parse(query.sort);
      }

      if (
        query.hasOwnProperty('distance') &&
        query.hasOwnProperty('lat') &&
        query.hasOwnProperty('lng')
      ) {
        sortQuery = '';
        searchQuery['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [query.lat, query.lng],
            },
            $maxDistance: query.distance,
            $minDistance: 0,
          },
        };
      }

      const cursor = this.model
        .find(searchQuery)
        .populate({
          path: 'user',
          select: {
            email: 1,
            isActive: 1,
            isVerified: 1,
            isSuperAdmin: 1,
            isAdmin: 1,
            cTime: 1,
          },
        })
        .populate([
          {
            path: 'location.city',
            select: {
              _id: 1,
              name: 1,
            },
          },
          {
            path: 'location.state',
            select: {
              _id: 1,
              name: 1,
            },
          },
          {
            path: 'location.country',
            select: {
              _id: 1,
              name: 1,
            },
          },
        ])
        .limit(limit)
        .skip(skip)
        .sort(sortQuery);

      const result: IUserProfiles = {
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
   * Count All user profile
   * @returns {Promise<number>}
   */
  async count(query: SearchUserProfileDto): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);

      if (
        query.hasOwnProperty('distance') &&
        query.hasOwnProperty('lat') &&
        query.hasOwnProperty('lng')
      ) {
        searchQuery['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [query.lat, query.lng],
            },
            $maxDistance: query.distance,
            $minDistance: 0,
          },
        };
      }

      return this.model.countDocuments(searchQuery).exec();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
