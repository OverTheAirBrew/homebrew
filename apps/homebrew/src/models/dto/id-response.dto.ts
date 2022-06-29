import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IdResponseDto {
  constructor(id?: string) {
    this.id = id;
  }

  @IsString()
  @ApiProperty()
  id: string;
}
