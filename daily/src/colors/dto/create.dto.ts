import { OmitType } from '@nestjs/swagger';
import { ColorDto } from './color.dto';
import { IColor } from '../interfaces';

export class CreateColorDto
    extends OmitType(ColorDto, [
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateColorDto> {
    constructor(data?: IColor) {
        super(data);
    }
}
