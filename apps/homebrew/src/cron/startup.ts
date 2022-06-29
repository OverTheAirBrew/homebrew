import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Timeout } from '@nestjs/schedule';
import { KettleService } from '../lib/services/kettle/service';
import { ProcessKettleLogic } from '../models/events/process-kettle-logic';

@Injectable()
export class StartupEvents {
  constructor(
    private kettleService: KettleService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Timeout(0)
  async startWorkers() {
    const runningKettles = await this.kettleService.getRunningKettles();

    for (const kettle of runningKettles) {
      this.eventEmitter.emit(
        ProcessKettleLogic.Channel,
        new ProcessKettleLogic(
          kettle.id,
          kettle.logicType_id,
          kettle.config,
          kettle.logicRun_id,
        ),
      );
    }
  }
}
