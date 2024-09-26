import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchQueryDto } from '../../common/dto';
import { IUser } from '../../users/interfaces/user.interface';
import {
  ThreadDto,
  CreateThreadDto,
  UpdateThreadDto,
  CreateChatDto,
} from '../dto';
import { IThread, IThreadsWithCount } from '../interfaces';
import { ChatsService } from './chats.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IChat } from '../interfaces';
import * as moment from 'moment-timezone';
import { SCHEMA } from '../../common/mock';

@WebSocketGateway({ cors: true })
@Injectable()
export class ThreadsService {
  @WebSocketServer() server: Server;
  private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';

  /**
   * Constructor
   * @param {Model<IThread>} model
   * @param {Model<ChatService>} chatService
   */
  constructor(
    @InjectModel(SCHEMA.THREAD)
    private readonly model: Model<IThread>, 
    private readonly chatService: ChatsService,
  ) {}

  /**
   * Create thread
   * @param {IUser} user
   * @param {CreateThreadDto} data
   * @returns {Promise<IThread>}
   */
  async create(
    user: IUser,
    data: CreateThreadDto,
  ): Promise<IThread | IChat | any> {
    try {
      const payload = new ThreadDto({
        ...data,
        userOne: user._id,
        cBy: user._id,
        cTime:
          (data?.timezone && moment().tz(data.timezone).valueOf()) ||
          Date.now(),
      });
      const searchQuery: any = {
        $or: [
          { userOne: user._id, userTwo: data.userTwo },
          { userOne: data.userTwo, userTwo: user._id },
        ],
      };
      const thread = await this.model.findOne(searchQuery);
      if (!thread) {
        const registerDoc = new this.model(payload);
        const saveThread = await registerDoc.save();
        this.server.emit(`new-thread-${payload.userOne}`, {
          thread: saveThread,
        });
        this.server.emit(`new-thread-${payload.userTwo}`, {
          thread: saveThread,
        });
        const chatDTO = new CreateChatDto({
          message: data.message,
          receiver: data.userTwo,
          thread: saveThread._id,
        });
        await this.chatService.create(user, chatDTO);
        return saveThread;
      } else {
        const chatData = new CreateChatDto({
          message: data.message,
          receiver: data.userTwo,
          thread: thread._id,
        });
        return await this.chatService.create(user, chatData);
      }
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit thread
   * @param {string} id
   * @param {UpdateThreadDTO} uThreadDTO
   * @param {IUser} user
   * @returns {Promise<IThread>}
   */
  async update(
    id: string,
    uThreadDTO: UpdateThreadDto,
    user: IUser,
  ): Promise<IThread> {
    try {
      const thread = await this.model.findOne({ _id: id });
      if (!thread) {
        throw new NotFoundException('Could not find thread.');
      }

      const threadDTO = new ThreadDto();
      threadDTO.uBy = user._id;
      threadDTO.uTime = Date.now();

      const setThread = {
        ...uThreadDTO,
        ...threadDTO,
      };

      return thread.set(setThread).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches thread
   * @returns {Promise<IThread[]>}
   */
  public async findAll(
    query: SearchQueryDto,
    user: IUser,
  ): Promise<IThreadsWithCount> {
    try {
      const searchQuery: any = {
        isDeleted: false,
        $or: [{ userOne: user._id }, { userTwo: user._id }],
      };

      const limit: number = (query && query.limit) || 20;
      const skip: number = (query && query.skip) || 0;

      const threads = await this.model
        .find(searchQuery)
        .populate({
          path: 'userOne',
          populate: {
            path: 'profile',
            select: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              middleName: 1,
              location: 1,
              profilePic: 1,
            },
          },
        })
        .populate({
          path: 'userTwo',
          populate: {
            path: 'profile',
            select: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              middleName: 1,
              location: 1,
              profilePic: 1,
            },
          },
        })
        .populate({
          path: 'chats',
          options: {
            sort: { $natural: 1 },
          },
        })
        .limit(limit)
        .skip(skip)
        .sort({ $natural: -1 })
        .exec();

      const receiverUnreadCount = await this.model
        .count({
          $or: [
            { userOne: user._id, isUserOneRead: false },
            { userTwo: user._id, isUserTwoRead: false },
          ],
        })
        .exec();
      return { threads: threads, receiverUnreadCount: receiverUnreadCount };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * find single thread
   * @param {string} id
   * @returns {Promise<IThread>}
   */
  async findOne(id: string): Promise<IThread> {
    try {
      const thread = await this.model
        .findOne({ _id: id })
        .populate('serviceProfile')
        .exec();
      if (!thread) {
        throw new NotFoundException('Could not find thread.');
      }
      return thread;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
