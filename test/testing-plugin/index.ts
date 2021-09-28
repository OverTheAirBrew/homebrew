import {
  Actor,
  ActorToken,
  IPackageConfig,
  Logic,
  LogicToken,
  Sensor,
  SensorToken,
} from '@overtheairbrew/homebrew-plugin';
import { Service } from 'typedi';

@Service({ id: SensorToken, multiple: true })
class TestSensor extends Sensor {
  constructor() {
    super('testing-sensor', []);
  }

  async run(params: any): Promise<number> {
    return 10;
  }
}

@Service({ id: LogicToken, multiple: true })
class TestLogic extends Logic {
  constructor() {
    super('test-logic', []);
  }

  async run(
    params: any,
  ): Promise<{ heatTime: number; waitTime: number; opts: any }> {
    return {
      heatTime: 10,
      waitTime: 10,
      opts: {},
    };
  }
}

@Service({ id: ActorToken, multiple: true })
class TestActor extends Actor {
  constructor() {
    super('test-actor', []);
  }

  async on(params: any): Promise<void> {
    return;
  }

  async off(params: any): Promise<void> {
    return;
  }
}

const config: IPackageConfig = {
  actors: [TestActor],
  logics: [TestLogic],
  sensors: [TestSensor],
};

export default config;
