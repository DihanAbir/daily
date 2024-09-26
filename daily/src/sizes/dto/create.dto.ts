import { OmitType } from '@nestjs/swagger';
import { SizeDto } from './size.dto';
import { ISize } from '../interfaces';

export class CreateSizeDto
    extends OmitType(SizeDto, [
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateSizeDto> {
    constructor(data?: ISize) {
        super(data);
    }
}
