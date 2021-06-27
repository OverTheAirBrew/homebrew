import { IsString } from 'class-validator';

export class IdResponse {
  @IsString()
  id: string;
}
