import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  HttpStatus,
  HttpException,
  MethodNotAllowedException,
  Query,
  Logger,
} from '@nestjs/common';
import { IUser } from '../../users/interfaces';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { User } from '../../common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { StateService } from '../services';
import {
  CreateStateDto,
  UpdateStateDto,
  SearchStateDto
} from '../dto';
import { IState, IStates } from '../interfaces';

/**
 * State Controller
 */
@ApiTags('Demography-State')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('states')
export class StateController {
  private readonly logger = new Logger(StateController.name);

  /**
   * Constructor
   * @param {StateService} stateService
   */
  constructor(private readonly stateService: StateService) { }

  /**
   * Create state
   * @param {IUser} user
   * @param {CreateStateDto} data
   * @returns {Promise<IState>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'state Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new state.',
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
  @Post()
  public async create(
    @User() user: IUser,
    @Body() data: CreateStateDto,
  ): Promise<IState> {
    try {
      return await this.stateService.create(user, data);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * update state
   * @Param {string} id
   * @Body {UpdateStateDto} data
   * @Param {IUser} user
   * @returns {Promise<IState>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'state update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated state.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'State not found',
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
    @Body() data: UpdateStateDto,
  ): Promise<IState> {
    try {
      return this.stateService.update(id, data);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find states
   * @Query {SearchStateDto} query
   * @returns {Promise<IStates>}
   */
  @ApiOperation({ summary: 'Get states' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'This is public api. Return states.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token is received or token expire',
  })
  @Get()
  @UsePipes(new ValidationPipe(true))
  findAll(@Query() query: SearchStateDto): Promise<IStates> {
    try {
      return this.stateService.findAll(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Bulk Insert country
   * @param {IUser} user
   * @param {CreateStateDTO} createStateDTO
   * @returns {Promise<ICountry>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Bulk Insert state' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new state.',
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
  @Post('bulk-insert')
  public async bulkInsert(
    @User() user: IUser,
  ) {
    try {
      return await this.stateService.bulkInsert(user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('bulk-insert')
  public bulkInsertGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('bulk-insert')
  public bulkInsertPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('bulk-insert')
  public bulkInsertPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('bulk-insert')
  public bulkInsertDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
