import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto';
import { ISize } from '../interfaces';

export class SizeDto extends BaseDto implements Readonly<SizeDto> {
    @ApiProperty()
    @IsMongoId()
    category: string;

    @ApiProperty()
    @IsString()
    region: string;

    @ApiProperty()
    @IsString()
    size: string;

    @ApiProperty()
    @IsString()
    description: string;

    constructor(data?: ISize) {
        super(data);
        if (data) {
            data.category && (this.category = data.category);
            data.region && (this.region = data.region);
            data.size && (this.size = data.size);
            data.description && (this.description = data.description);
        }
    }
}
