import {
    IsBoolean,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
    MediaDto,
    BaseDto
} from '../../common/dto';
import {
    IMedia,
} from '../../common/interfaces';
import { IBrand } from '../interfaces';

export class BrandDto extends BaseDto implements Readonly<BrandDto> {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({
        required: false
    })
    @IsString()
    description: string;

    @ApiProperty({
        type: MediaDto,
        required: false
    })
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    image: IMedia;

    @ApiProperty({
        required: false
    })
    @IsBoolean()
    isApproved: boolean;

    constructor(data?: IBrand) {
        super(data);
        if (data) {
            data.name && (this.name = data.name);
            data.image && (this.image = data.image);
            data.hasOwnProperty('isApproved') && (this.isApproved = data.isApproved)
        }
    }
}
