import {
  HttpStatus,
  Controller,
  Body,
  Delete,
  Get,
  HttpException,
  MethodNotAllowedException,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { TrimPipe, ValidationPipe } from '../../common/pipes';
import { IUser } from '../../users/interfaces';
import {
  CreateFavouriteDto,
  UpdateFavouriteDto,
  SearchFavouriteDto,
} from '../dto';
import { IFavourites, IFavourite } from '../interfaces';
import { FavouritesService } from '../services';
import { IProducts } from 'src/products/interfaces';

@ApiTags('Favourites')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('favourites')
export class FavouritesController {
  /**
   * Constructor
   * @param {FavouritesService} service
   */
  constructor(private readonly service: FavouritesService) {}

  /**
   * create
   * @Body {CreateFavouriteDto} data
   * @user {IUser} user
   * @returns {Promise<IFavourite>}
   */
  @ApiOperation({ summary: 'Favourite creation' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return Favourite.',
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
  create(
    @User() user: IUser,
    @Body() data: CreateFavouriteDto,
  ): Promise<IFavourite> {
    try {
      return this.service.create(data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
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
   * find all records
   * @returns {Promise<IProducts>}
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all records' })
  @UsePipes(new ValidationPipe(true))
  @UseGuards(JwtAuthGuard)
  @Get()
  public findAll(@Query() query: SearchFavouriteDto, @User() user: IUser): Promise<IProducts> {
    try {
      return this.service.findAll(query, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * favourite update
   * @Body {UpdateFavouriteDto} data
   * @User {IUser} user
   * @returns {Promise<IFavourite>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Favourite update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated record.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'record not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async update(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() data: UpdateFavouriteDto,
  ): Promise<IFavourite> {
    try {
      return await this.service.update(id, data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  @ApiExcludeEndpoint()
  @Post(':id')
  public updatePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put(':id')
  public updatePut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Favourite delete' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return deleted record.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'record not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public delete(
    @Param('id') id: string,
  ) {
    try {
      return this.service.delete(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
