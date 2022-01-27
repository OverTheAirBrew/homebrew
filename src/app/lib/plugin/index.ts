import { Service, Token } from 'typedi';

export const SENSOR_TOKEN = new Token('sensor');
export const ACTOR_TOKEN = new Token('actor');

export function ActorService() {
  return Service({ id: ACTOR_TOKEN, multiple: true });
}

export function SensorService() {
  return Service({ id: SENSOR_TOKEN, multiple: true });
}
