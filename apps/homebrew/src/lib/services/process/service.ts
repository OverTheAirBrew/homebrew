import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILockingClient } from '@ota-internal/locking';
import { ProcessKettleLogic } from '../../../models/events/process-kettle-logic';
import { ActorTypesService } from '../actor-types/service';
import { ActorService } from '../actor/service';
import { DeviceService } from '../device/service';
import { KettleService } from '../kettle/service';
import { LogicTypesService } from '../logic-types/service';
import { TelemetryService } from '../telemetry/service';

@Injectable()
export class ProcessService {
  constructor(
    private kettleService: KettleService,
    private logicService: LogicTypesService,
    private actorService: ActorService,
    private telemetryService: TelemetryService,
    private actorTypeService: ActorTypesService,
    private deviceService: DeviceService,
    private eventEmitter: EventEmitter2,
    private lockService: ILockingClient,
  ) {}

  public async processKettleLogic<T>(
    kettle_id: string,
    logicType_id: string,
    config: T,
    run_id: string,
  ) {
    const kettle = await this.kettleService.getKettleById(kettle_id);

    if (!kettle.targetTemperature) {
      await this.kettleService.toggleKettleWorking(kettle_id);
      return;
    }

    if (!kettle.logicRun_id || kettle.logicRun_id !== run_id) return;

    const { unlock } = await this.lockService.lock(
      `process-kettle:${kettle_id}`,
      10000,
    );

    try {
      const [logicType, latestTemperature, actor] = await Promise.all([
        this.logicService.getRawLogicTypeById(logicType_id),
        this.telemetryService.getLatestValue(kettle.sensor_id),
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
        config,
        latestTemperature,
        kettle.targetTemperature,
      );

      // await actorType.on(actor.id, actor.config);
      await new Promise((resolve) => setTimeout(resolve, heatTime));
      // await actorType.off(actor.id, actor.config);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      this.eventEmitter.emit(
        ProcessKettleLogic.Channel,
        new ProcessKettleLogic(kettle_id, logicType_id, nextParams, run_id),
      );
    } finally {
      if (unlock) await unlock();
    }
  }
}
