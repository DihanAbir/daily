import {
    IsMongoId,
    IsString,
    ValidateNested,
    IsArray,
    IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
    MediaDto,
    BaseDto
} from '../../common/dto';
import { IMedia } from '../../common/interfaces';
import { IProduct } from '../interfaces';
import { AvaibilityStatus } from '../../common/mock';

export class ProductDto extends BaseDto implements Readonly<ProductDto> {
    @ApiProperty()
    @IsMongoId()
    owner: string;

    @ApiProperty()
    @IsMongoId()
    category: string;

    @ApiProperty()
    // @IsMongoId()
    collections: string[];

    @ApiProperty()
    @IsMongoId()
    size: string;

    @ApiProperty()
    @IsMongoId()
    color: string;

    @ApiProperty()
    @IsMongoId()
    brand: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    slug: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({
        required: false,
        enum: AvaibilityStatus
    })
    @IsEnum(AvaibilityStatus)
    @IsString()
    status: string;

    @ApiProperty({
        type: [String],
    })
    @IsArray()
    base64EncodedStrings: string[];

    @ApiProperty({
        type: [MediaDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    images: [IMedia];

    @ApiProperty({
        type: [MediaDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    videos: [IMedia];

    @ApiProperty()
    retailPrice: number;

    @ApiProperty()
    rentPerDayPrice: number;

    @ApiProperty()
    minimalRentalPeriodInDays: number;

    @ApiProperty()
    cleaningPrice: number;

    @ApiProperty()
    viewCount: number;

    @ApiProperty()
    ratings: number;

    @ApiProperty()
    @IsString()
    postage: string;

    constructor(data?: IProduct) {
        super(data);
        if (data) {
            data.owner && (this.owner = data.owner);
            data.category && (this.category = data.category);
            data.collections && (this.collections = data.collections);
            data.size && (this.size = data.size);
            data.color && (this.color = data.color);
            data.brand && (this.brand = data.brand);
            data.title && (this.title = data.title);
            data.size && (this.size = data.size);
            data.description && (this.description = data.description);
            data.slug && (this.slug = data.slug);
            data.description && (this.description = data.description);
            data.images && (this.images = data.images);
            data.videos && (this.videos = data.videos);
            data.retailPrice && (this.retailPrice = data.retailPrice);
            data.rentPerDayPrice && (this.rentPerDayPrice = data.rentPerDayPrice);
            data.minimalRentalPeriodInDays && (this.minimalRentalPeriodInDays = data.minimalRentalPeriodInDays);
            data.cleaningPrice && (this.cleaningPrice = data.cleaningPrice);
            data.viewCount && (this.viewCount = data.viewCount);
            data.ratings && (this.ratings = data.ratings);
            data.postage && (this.postage = data.postage);
            data.hasOwnProperty('isActive') && (this.isActive = data.isActive)
        }
    }
}
