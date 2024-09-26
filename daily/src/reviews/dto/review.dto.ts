import { IsArray, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, MediaDto } from '../../common/dto';
import { IReview } from '../interfaces/review.interface';

export class ReviewDto extends BaseDto implements Readonly<ReviewDto> {
  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  reviewer: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  user: string;

  @ApiProperty()
  @IsMongoId()
  product: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  rent: string;

  @ApiProperty()
  review: string;

  @ApiProperty()
  reply: string;

  @ApiProperty()
  ratings: number;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  pictures: MediaDto[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  base64EncodedStrings: string[];

  @ApiProperty()
  helpfulCount: number;

  constructor(data?: IReview) {
    super(data);
    if (data) {
      data.title && (this.title = data.title);
      data.slug && (this.slug = data.slug);
      data.reviewer && (this.reviewer = data.reviewer);
      data.user && (this.user = data.user);
      data.product && (this.product = data.product);
      data.rent && (this.rent = data.rent);
      data.review && (this.review = data.review);
      data.reply && (this.reply = data.reply);
      data.ratings && (this.ratings = data.ratings);
      data.pictures && (this.pictures = data.pictures);
      data.helpfulCount && (this.helpfulCount = data.helpfulCount);
    }
  }
}
