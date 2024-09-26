import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto';

import { IColor } from '../interfaces';

export class ColorDto extends BaseDto implements Readonly<ColorDto> {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    code: string;

    constructor(data?: IColor) {
        super(data);
        if (data) {
            data.name && (this.name = data.name);
            data.code && (this.code = data.code);
        }
    }
}
