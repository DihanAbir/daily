import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
    HttpException,
    HttpStatus,
    MethodNotAllowedException,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExcludeEndpoint,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUser } from '../../users/interfaces/user.interface';
import { CreateNotificationDto, UpdateNotificationDto, SearchNotificationDto } from '../dto';
import { NotificationsService } from '../services/notifications.service';
import { INotification, INotificationWithCount } from '../interfaces';

@ApiTags('Notification')
@ApiResponse({
    status: HttpStatus.METHOD_NOT_ALLOWED,
    description: 'Method not allowed',
})
@ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error!',
})
@Controller('notifications')
export class NotificationsController {
    /**
     * Constructor
     * @param {NotificationsService} notificationService
     */
    constructor(private readonly notificationService: NotificationsService) { }

    /**
     * Create notification
     * @param {IUser} user
     * @param {CreateNotificationDto} data
     * @returns {Promise<INotification>}
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'Notification Creation' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Return new notification.',
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
        @Body() data: CreateNotificationDto,
    ): Promise<INotification> {
        try {
            return this.notificationService.create(data);
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
    @Delete()
    public createDelete() {
        throw new MethodNotAllowedException('Method not allowed');
    }

    /**
     * update Notification
     * @Param {string} id
     * @Body {UpdateNotificationDto} data
     * @returns {Promise<INotification>}
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'Notification update' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return updated notification.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Notification not found',
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
        @Body() data: UpdateNotificationDto,
    ): Promise<INotification> {
        try {
            return this.notificationService.update(id, data);
        } catch (err) {
            throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
        }
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

    /**
     * update bulk Notification
     * @User {IUser} user
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'Notification update bulk' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return updated notification bulk.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Notification not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid data',
    })
    @UsePipes(new ValidationPipe(true))
    @UsePipes(new TrimPipe())
    @UseGuards(JwtAuthGuard)
    @Patch()
    public async updateBulk(@User() user: IUser) {
        try {
            return this.notificationService.updateBulk(user);
        } catch (err) {
            throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Find notifications
     * @Query {Object} query
     * @User {IUser} user
     * @returns {Promise<INotificationWithCount[]>}
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({ summary: 'Get All notification' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return chats.',
    })
    @UseGuards(JwtAuthGuard)
    @Get()
    @UsePipes(new ValidationPipe(true))
    async findAll(
        @Query() query: SearchNotificationDto | null,
        @User() user: IUser,
    ): Promise<INotificationWithCount> {
        try {
            return this.notificationService.findAll(user, query);
        } catch (err) {
            throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
        }
    }
}
