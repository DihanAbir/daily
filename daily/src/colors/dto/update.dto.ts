import { OmitType } from '@nestjs/swagger';
import { ColorDto } from './color.dto';
import { IColor } from '../interfaces';

export class UpdateColorDto
    extends OmitType(ColorDto, [
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateColorDto> {
    constructor(data?: IColor) {
        super(data);
    }
}
