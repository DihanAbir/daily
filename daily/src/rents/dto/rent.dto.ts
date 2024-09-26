import {
    IsMongoId,
    IsString,
    ValidateNested,
    IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
    BaseDto,
    LocationDto
} from '../../common/dto';
import { ILocation } from '../../common/interfaces';
import { IRent } from '../interfaces';
import { RentStatus, PaymentStatus, DeliveryMethod } from '../../common/mock';

export class RentDto extends BaseDto implements Readonly<RentDto> {
    @ApiProperty()
    @IsMongoId()
    product: string;

    @ApiProperty()
    @IsMongoId()
    owner: string;

    @ApiProperty()
    @IsMongoId()
    customer: string;

    @ApiProperty({
        type: LocationDto,
    })
    @ValidateNested({ each: true })
    @Type(() => LocationDto)
    location: ILocation;

    @ApiProperty()
    rentFromDate: number;

    @ApiProperty()
    rentToDate: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    priceBreakdown: Record<string, any>; // Define as Record<string, any> for JSON object

    @ApiProperty({
        enum: RentStatus
    })
    @IsEnum(RentStatus)
    @IsString()
    status: string;

    @ApiProperty({
        enum: PaymentStatus
    })
    @IsEnum(PaymentStatus)
    @IsString()
    paymentStatus: string;

    @ApiProperty()
    @IsString()
    notesForOwner: string;

    @ApiProperty({
        enum: DeliveryMethod
    })
    @IsEnum(DeliveryMethod)
    @IsString()
    deliveryMethod: string;

    constructor(data?: IRent) {
        super(data);
        if (data) {
            data.product && (this.product = data.product);
            data.owner && (this.owner = data.owner);
            data.customer && (this.customer = data.customer);
            data.location && (this.location = data.location);
            data.rentFromDate && (this.rentFromDate = data.rentFromDate);
            data.rentToDate && (this.rentToDate = data.rentToDate);
            data.price && (this.price = data.price);
            data.priceBreakdown && (this.priceBreakdown = data.priceBreakdown);
            data.status && (this.status = data.status);
            data.paymentStatus && (this.paymentStatus = data.paymentStatus);
            data.notesForOwner && (this.notesForOwner = data.notesForOwner);
            data.deliveryMethod && (this.deliveryMethod = data.deliveryMethod);
        }
    }
}
