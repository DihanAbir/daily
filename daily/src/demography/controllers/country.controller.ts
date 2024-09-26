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
import { CountryService } from '../services';
import { 
  CreateCountryDto,
  UpdateCountryDto
} from '../dto';
import { ICountry, ICountries } from '../interfaces';
import { SearchQueryDto } from '../../common/dto';

/**
 * Country Controller
 */
@ApiTags('Demography-Country')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('countries')
export class CountryController {
  private readonly logger = new Logger(CountryController.name);

  /**
   * Constructor
   * @param {CountryService} countryService
   */
  constructor(private readonly countryService: CountryService) {}

  /**
   * Create country
   * @param {IUser} user
   * @param {CreateCountryDto} data
   * @returns {Promise<ICountry>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'country Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new country.',
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
    @Body() data: CreateCountryDto,
  ): Promise<ICountry> {
    try {
      return await this.countryService.create(user, data);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find countries
   * @Query {Object} query
   * @returns {Promise<ICountry[]>}
   */
  @ApiOperation({ summary: 'Get countries' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'This is public api. Return countries.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token is received or token expire',
  })
  @Get()
  @UsePipes(new ValidationPipe(true))
  findAll(@Query() query: SearchQueryDto): Promise<ICountries> {
    try {
      return this.countryService.findAll(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * update country
   * @Param {string} id
   * @Body {UpdateCountryDto} data
   * @Param {IUser} user
   * @returns {Promise<ICountry>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Country update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated country.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
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
    @Body() data: UpdateCountryDto,
    @User() user: IUser,
  ): Promise<ICountry> {
    try {
      return this.countryService.update(id, data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Bulk Insert country
   * @param {IUser} user
   * @param {CreateCountryDto} data
   * @returns {Promise<ICountry>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Bulk Insert country' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new country.',
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
      return await this.countryService.bulkInsert(user);
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
