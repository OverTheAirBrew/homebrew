import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { LockService } from '@s1seven/nestjs-tools-lock';
import { ActorTypesService } from '../lib/services/actor-types/service';
import { ActorService } from '../lib/services/actor/service';
import { DeviceService } from '../lib/services/device/service';
import { KettleService } from '../lib/services/kettle/service';
import { LogicTypesService } from '../lib/services/logic-types/service';
import { TelemetryService } from '../lib/services/telemetry/service';
import { ProcessKettleLogic } from '../models/events/process-kettle-logic';

@Injectable()
export class KettleWorkingService {
  constructor(
    private kettleService: KettleService,
    private logicService: LogicTypesService,
    private actorService: ActorService,
    private telemetryService: TelemetryService,
    private actorTypeService: ActorTypesService,
    private deviceService: DeviceService,
    private eventEmitter: EventEmitter2,
    @Inject(LockService) private lockService: LockService,
  ) {}

  @OnEvent(ProcessKettleLogic.Channel)
  async processKettleLogic(payload: ProcessKettleLogic<any>) {
    const kettle = await this.kettleService.getKettleById(payload.kettle_id);

    if (!kettle.targetTemperature) {
      await this.kettleService.toggleKettleWorking(payload.kettle_id);
      return;
    }

    if (!kettle.logicRun_id || kettle.logicRun_id !== payload.run_id) return;

    const { unlock } = await this.lockService.lock(
      `process-kettle:${payload.kettle_id}`,
      10000,
    );

    try {
      const [logicType, latestTemperature, actor] = await Promise.all([
        this.logicService.getRawLogicTypeById(payload.logicType),
        this.telemetryService.getLatestTemperature(kettle.sensor_id),
        this.actorService.getActorById(kettle.heater_id),
      ]);

      const deviceType = await this.deviceService.getDeviceById(
        actor.device_id,
      );

      const actorType = await this.actorTypeService.getRawActorTypeById(
        deviceType.type_id,
        actor.type_id,
      );

      const { heatTime, waitTime, nextParams } = await logicType.run(
        payload.config,
        latestTemperature,
        kettle.targetTemperature,
      );

      console.log(heatTime, waitTime, nextParams);

      // await actorType.on(actor.id, actor.config);
      await new Promise((resolve) => setTimeout(resolve, heatTime));
      // await actorType.off(actor.id, actor.config);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      this.eventEmitter.emit(
        ProcessKettleLogic.Channel,
        new ProcessKettleLogic(
          payload.kettle_id,
          payload.logicType,
          nextParams,
          payload.run_id,
        ),
      );
    } finally {
      if (unlock) await unlock();
    }
  }
}
