import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SearchQueryDto } from 'src/common/dto';
import { IChat, IThread } from '../interfaces';
import { ChatDto, CreateChatDto, UpdateChatDto } from '../dto';
import { IUser } from '../../users/interfaces';
import moment from 'moment-timezone';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { decodeToken, encodeToken } from '../../common/utils/helper';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SCHEMA } from '../../common/mock';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatsService {
  @WebSocketServer() server: Server;
  private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';
  /**
   * Constructor
   * @param {Model<IChat>} chatModel
   * @param {Model<IThread>} threadModel
   */
  constructor(
    @InjectModel(SCHEMA.CHAT)
    private readonly chatModel: Model<IChat>,
    @InjectModel(SCHEMA.THREAD)
    private readonly threadModel: Model<IThread>,
  ) {}

  /**
   * Create chat
   * @param {IUser} user
   * @param {CreateChatDTO} createChatDTO
   * @returns {Promise<IChat>}
   */
  async create(user: IUser, data: CreateChatDto): Promise<IChat> {
    try {
      const createdTime =
        (data.timezone && moment().tz(data.timezone).valueOf()) || Date.now();
      const message = await encodeToken(data.message, this.password);
      const charDto = new ChatDto({
        ...data,
        sender: user._id,
        message: message,
        cTime: createdTime,
        cBy: user._id,
      });
      const setChat = charDto;
      const registerDoc = new this.chatModel(setChat);
      const saveChat = await registerDoc.save();
      saveChat.message = await decodeToken(saveChat.message, this.password);
      await this.threadModel.updateOne(
        {
          _id: data.thread,
          userOne: data.receiver,
          isUserOneRead: true,
        },
        { $set: { isUserOneRead: false } },
      );
      await this.threadModel.updateOne(
        {
          _id: data.thread,
          userTwo: data.receiver,
          isUserTwoRead: true,
        },
        { $set: { isUserTwoRead: false } },
      );
      const receiverUnreadCount = await this.threadModel
        .count({
          $or: [
            { userOne: data.receiver, isUserOneRead: false },
            { userTwo: data.receiver, isUserTwoRead: false },
          ],
        })
        .exec();
      this.server.emit(`thread-message-${registerDoc.thread}`, {
        thread: saveChat.thread,
        chat: saveChat,
        receiverUnreadCount: receiverUnreadCount,
      });
      return saveChat;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit chat
   * @param {string} id
   * @param {UpdateChatDTO} uChatDTO
   * @param {IUser} user
   * @returns {Promise<IChat>}
   */
  async update(
    id: string,
    uChatDTO: UpdateChatDto,
    user: IUser,
  ): Promise<IChat> {
    try {
      const chat = await this.chatModel.findOne({ _id: id });
      if (!chat) {
        throw new NotFoundException('Could not find chat.');
      }

      const chatDTO = new ChatDto();
      chatDTO.uBy = user._id;
      chatDTO.uTime = Date.now();

      const setChat = {
        ...uChatDTO,
        ...chatDTO,
      };

      return chat.set(setChat).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches chats
   * @returns {Promise<IChat[]>}
   */
  public async findAll(query: SearchQueryDto): Promise<IChat[]> {
    try {
      const searchQuery: any = {
        isDeleted: false,
      };

      const limit: number = (query && query.limit) || 100;
      const skip: number = (query && query.skip) || 0;
      return await this.chatModel
        .find(searchQuery)
        .limit(limit)
        .skip(skip)
        .sort({ $natural: -1 })
        .exec();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async bulkEncryptMessage() {
    try {
      const chats = await this.chatModel.find();
      chats.map(async (chat) => {
        const chatDTO = new ChatDto();
        chatDTO.message = await encodeToken(chat.message, this.password);
        chatDTO.isRead = true;
        await chat.set(chatDTO).save();
      });
      return chats;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
