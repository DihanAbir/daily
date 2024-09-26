import { OmitType } from '@nestjs/swagger';
import { CollectionDto } from './collection.dto';
import { ICollection } from '../interfaces';

export class CreateCollectionDto
    extends OmitType(CollectionDto, [
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateCollectionDto> {
    constructor(data?: ICollection) {
        super(data);
    }
}
