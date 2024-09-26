import { OmitType } from '@nestjs/swagger';
import { CollectionDto } from './collection.dto';
import { ICollection } from '../interfaces';

export class UpdateCollectionDto
    extends OmitType(CollectionDto, [
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateCollectionDto> {
    constructor(data?: ICollection) {
        super(data);
    }
}
