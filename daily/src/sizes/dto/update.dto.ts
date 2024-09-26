import { OmitType } from '@nestjs/swagger';
import { SizeDto } from './size.dto';
import { ISize } from '../interfaces';

export class UpdateSizeDto
    extends OmitType(SizeDto, [
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateSizeDto> {
    constructor(data?: ISize) {
        super(data);
    }
}
