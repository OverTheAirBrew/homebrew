import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ActorService } from '../../lib/services/actor/service';
import { ActorDto } from '../../models/dto/actor.dto';
import { IdResponseDto } from '../../models/dto/id-response.dto';

@ApiTags('actors')
@Controller('actors')
export class ActorController {
  constructor(private service: ActorService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: IdResponseDto,
  })
  @ApiOperation({ summary: 'Create a new actor' })
  async createActor(@Body() actor: ActorDto) {
    const actor_id = await this.service.createActor(
      actor.name,
      actor.device_id,
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

  @Get('/:actorId')
  @ApiOkResponse({
    type: ActorDto,
  })
  async getActorById(@Param('actorId') actorId: string) {
    return await this.service.getActorById(actorId);
  }
}
