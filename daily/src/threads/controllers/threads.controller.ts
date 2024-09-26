import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { IChat, IThread, IThreadsWithCount } from '../interfaces';
import { IUser } from '../../users/interfaces';
import { User } from '../../common/decorators';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TrimPipe, ValidationPipe } from '../../common/pipes';
import { CreateThreadDto, UpdateThreadDto } from '../dto';
import { EmailInterceptor } from '../../common/interceptor';
import { ThreadsService } from '../services';
import { SearchQueryDto } from 'src/common/dto';

@ApiTags('Thraed')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('threads')
export class ThreadsController {
  /**
   * Constructor
   * @param {ThreadService} threadService
   */
  constructor(private readonly threadService: ThreadsService) {}

  /**
   * Create thread
   * @param {IUser} user
   * @param {CreateThreadDTO} cThreadDTO
   * @returns {Promise<IThread | IChat>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Thread Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new thread.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(EmailInterceptor)
  @Post()
  public async create(
    @User() user: IUser,
    @Body() cThreadDTO: CreateThreadDto,
  ): Promise<IThread | IChat> {
    try {
      return this.threadService.create(user, cThreadDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }


  @ApiExcludeEndpoint()
  @Put()
  public createPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch()
  public createPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete()
  public createDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * update thread
   * @Param {string} id
   * @Body {UpdateThreadDTO} uThreadDTO
   * @Param {IUser} user
   * @returns {Promise<IThread>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Thread update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated thread.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Thread not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() uThreadDTO: UpdateThreadDto,
    @User() user: IUser,
  ): Promise<IThread> {
    try {
      return this.threadService.update(id, uThreadDTO, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }


  @ApiExcludeEndpoint()
  @Put(':id')
  public updateThemePut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Post(':id')
  public updateThemePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Find thread
   * @Query {Object} query
   * @returns {Promise<IThread[]>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Get All thread' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return threads.',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @UsePipes(new ValidationPipe(true))
  findAll(
    @Query() query: SearchQueryDto | null,
    @User() user: IUser,
  ): Promise<IThreadsWithCount> {
    try {
      return this.threadService.findAll(query, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }


  @ApiExcludeEndpoint()
  @Put()
  public findAllPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch()
  public findAllPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete()
  public findAllDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Find one thread
   * @param {string} id
   * @returns {Promise<IJobRequest>}
   */
  @ApiOperation({ summary: 'Get specific thread' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ' Return single thread.',
  })
  @Get(':id')
  public findOne(@Param('id') id: string): Promise<IThread> {
    try {
      return this.threadService.findOne(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  
  @ApiExcludeEndpoint()
  @Post(':id')
  public findOnePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put(':id')
  public findOnePut() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
