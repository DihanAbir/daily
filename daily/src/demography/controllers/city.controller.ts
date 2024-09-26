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
import { CityService } from '../services';
import {
  CreateCityDto,
  UpdateCityDto,
  SearchCityDto
} from '../dto';
import { ICity, ICities } from '../interfaces';

/**
 * City Controller
 */
@ApiTags('Demography-City')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('cities')
export class CityController {
  private readonly logger = new Logger(CityController.name);

  /**
   * Constructor
   * @param {CityService} cityService
   */
  constructor(private readonly cityService: CityService) { }

  /**
   * Create city
   * @param {IUser} user
   * @param {CreateCityDto} data
   * @returns {Promise<ICity>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'city Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new city.',
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
    @Body() data: CreateCityDto,
  ): Promise<ICity> {
    try {
      return await this.cityService.create(user, data);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find cities
   * @Query {SearchCityDto} query
   * @returns {Promise<ICities>}
   */
  @ApiOperation({ summary: 'Get cities' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'This is public api. Return cities.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token is received or token expire',
  })
  @Get()
  @UsePipes(new ValidationPipe(true))
  findAll(@Query() query: SearchCityDto): Promise<ICities> {
    try {
      return this.cityService.findAll(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Bulk Insert city
   * @param {IUser} user
   * @returns {Promise<ICountry>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Bulk Insert city' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new city.',
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
  public async bulkInsert(@User() user: IUser) {
    try {
      return await this.cityService.bulkInsert(user);
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

  /**
   * update city
   * @Param {string} id
   * @Body {UpdateCityDto} data
   * @Param {IUser} user
   * @returns {Promise<ICity>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'city update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated city.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'City not found',
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
    @Body() data: UpdateCityDto,
  ): Promise<ICity> {
    try {
      return this.cityService.update(id, data);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  public updateThemeGet() {
    throw new MethodNotAllowedException('Method not allowed');
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

  @ApiExcludeEndpoint()
  @Delete(':id')
  public updateThemeDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
