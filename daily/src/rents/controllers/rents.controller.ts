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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { TrimPipe, ValidationPipe } from '../../common/pipes';
import { IUser } from '../../users/interfaces';
import { CreateRentDto, UpdateRentDto, SearchRentDto } from '../dto';
import { IRents, IRent } from '../interfaces';
import { RentsService } from '../services';
import { NotificationInterceptor } from '../../common/interceptor';

@ApiTags('Rents')
@ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error!',
})
@Controller('rents')
export class RentsController {
    /**
     * Constructor
     * @param {RentsService} service
     */
    constructor(private readonly service: RentsService) { }

    /**
     * Record create
     * @Body {CreateRentDto} data
     * @user {IUser} user
     * @returns {Promise<IRent>}
     */
    @ApiOperation({ summary: 'Record creation' })
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Return record.',
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
    @UseInterceptors(NotificationInterceptor)
    @Post()
    create(@User() user: IUser, @Body() data: CreateRentDto): Promise<IRent> {
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
     * find all records
     * @returns {Promise<IRents>}
     */
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all records' })
    @UsePipes(new ValidationPipe(true))
    @UseGuards(JwtAuthGuard)
    @Get()
    public findAll(@Query() query: SearchRentDto): Promise<IRents> {
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
     * count records
     * @returns {Promise<number>}
     */
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Count records' })
    @UsePipes(new ValidationPipe(true))
    @UseGuards(JwtAuthGuard)
    @Get('count')
    public count(@Query() query: SearchRentDto): Promise<number> {
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
     * @returns {Promise<IRent>} 
     */
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get record from id' })
    @ApiResponse({ status: 200, description: 'Return record.' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User Not found.',
    })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getOne(
        @Param('id') id: string,
    ): Promise<IRent> {
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
     * Record update
     * @Body {UpdateRentDto} data
     * @User {IUser} user
     * @returns {Promise<IRent>}
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'Record update' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return updated Record.' })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Record not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid data',
    })
    @UsePipes(new ValidationPipe(true))
    @UsePipes(new TrimPipe())
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(NotificationInterceptor)
    @Patch(':id')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() data: UpdateRentDto,
    ): Promise<IRent> {
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



