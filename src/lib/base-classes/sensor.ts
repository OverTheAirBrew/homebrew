import Container from 'typedi';
import { SensorReading } from '../messages/sensor-reading';
import { SocketIo } from '../socket';

export interface ISensor {
  run: () => Promise<number>;
}

export abstract class Sensor implements ISensor {
  private socket: SocketIo;

  constructor() {
    this.socket = Container.get<SocketIo>(SocketIo);
  }

  protected async dataRecieved(sensor_id: string, value: number) {
    await this.socket.send(SensorReading)({
      sensor_id,
      value,
    });
  }

  public abstract run(): Promise<number>;
}
