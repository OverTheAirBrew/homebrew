import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActorService } from '../lib/services/actor/service';
import { ActorDto } from '../models/dto/actor.dto';
import { IdResponseDto } from '../models/dto/id-response.dto';

@ApiTags('actors')
@Controller('actors')
export class ActorController {
  constructor(private service: ActorService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: IdResponseDto,
  })
  async createActor(@Body() actor: ActorDto) {
    const actor_id = await this.service.createActor(
      actor.name,
      actor.type_id,
      actor.config,
    );

    return new IdResponseDto(actor_id);
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
