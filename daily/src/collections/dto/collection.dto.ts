import {
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
import { ICollection } from '../interfaces';

export class CollectionDto extends BaseDto implements Readonly<CollectionDto> {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({
        type: MediaDto,
    })
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    image: IMedia;

    constructor(data?: ICollection) {
        super(data);
        if (data) {
            data.name && (this.name = data.name);
            data.image && (this.image = data.image);
        }
    }
}
