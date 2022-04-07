import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActorDto } from '../../models/dto/actor.dto';
import { IdResponseDto } from '../../models/dto/id-response.dto';
import { ActorService } from './service';

@ApiTags('actors')
@Controller('actors')
export class ActorController {
  constructor(private service: ActorService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: IdResponseDto,
  })
  async createActor(@Body() actor: ActorDto) {
    const actor_id = await this.service.createActor(
      actor.name,
      actor.type_id,
      actor.config,
    );

    return {
      id: actor_id,
    };
  }

  @Get('/')
  @ApiOkResponse({
    type: ActorDto,
    isArray: true,
  })
  async getActors() {
    return await this.service.getAllActors();
  }
}
