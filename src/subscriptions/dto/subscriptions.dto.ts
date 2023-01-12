import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class newSubscription {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUrl(undefined, { message: 'Url is not valid.' })
  url: string;
}