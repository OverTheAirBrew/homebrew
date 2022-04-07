import { IsString } from 'class-validator';

export class IdResponseDto {
  constructor(id?: string) {
    this.id = id;
  }

  @IsString()
  id: string;
}
