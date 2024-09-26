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
} from '@nestjs/common';
import {
    ApiTags,
    ApiResponse,
    ApiBearerAuth,
    ApiExcludeEndpoint,
    ApiHeader,
    ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { TrimPipe, ValidationPipe } from '../../common/pipes';
import { IUser } from '../../users/interfaces';
import { CreateSizeDto, UpdateSizeDto, SearchSizeDto } from '../dto';
import { ISizes, ISize } from '../interfaces';
import { SizesService } from '../services';

@ApiTags('Size')
@ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error!',
})
@Controller('sizes')
export class SizesController {
    /**
     * Constructor
     * @param {SizesService} service
     */
    constructor(private readonly service: SizesService) { }

    /**
     * Size create
     * @Body {CreateSizeDto} data
     * @user {IUser} user
     * @returns {Promise<ISize>}
     */
    @ApiOperation({ summary: 'Size creation' })
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Return size.',
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
    create(@User() user: IUser, @Body() data: CreateSizeDto): Promise<ISize> {
        try {
            return this.service.create(data, user);
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
     * find all sizes
     * @returns {Promise<ISizes>}
     */
    @ApiOperation({ summary: 'Get all sizes' })
    @UsePipes(new ValidationPipe(true))
    @Get()
    public findAll(@Query() query: SearchSizeDto): Promise<ISizes> {
        try {
            return this.service.findAll(query);
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
     * count sizes
     * @returns {Promise<number>}
     */
    @ApiOperation({ summary: 'Count sizes' })
    @UsePipes(new ValidationPipe(true))
    @Get('count')
    public count(@Query() query: SearchSizeDto): Promise<number> {
        try {
            return this.service.count(query);
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
    @ApiExcludeEndpoint()
    @Post('count')
    public countPost() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Put('count')
    public countPut() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Patch('count')
    public countPatch() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Delete('count')
    public countDelete() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    /**
     * @Param {string} id
     * @returns {Promise<ISize>} 
     */
    @ApiOperation({ summary: 'Get size from id' })
    @ApiResponse({ status: 200, description: 'Return size information.' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User Not found.',
    })
    @Get(':id')
    public async getOne(
        @Param('id') id: string,
    ): Promise<ISize> {
        try {
            return await this.service.findOne(id);
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
     * Size update
     * @Body {UpdateSizeDto} data
     * @User {IUser} user
     * @returns {Promise<ISize>}
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'Size update' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return updated size.' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Size not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid data',
    })
    @UsePipes(new ValidationPipe(true))
    @UsePipes(new TrimPipe())
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() data: UpdateSizeDto,
    ): Promise<ISize> {
        try {
            return this.service.update(id, data, user);
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

    @ApiExcludeEndpoint()
    @Post(':id')
    public updatePost() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    @ApiExcludeEndpoint()
    @Delete(':id')
    public updateDelete() {
        throw new MethodNotAllowedException('Method not allowed');
    }
}


