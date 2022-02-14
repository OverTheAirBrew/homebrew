import { Service, Token } from 'typedi';

export const SENSOR_TOKEN = new Token('sensor');
export const ACTOR_TOKEN = new Token('actor');
export const LOGIC_TOKEN = new Token('logic');

export function ActorService() {
  return Service({ id: ACTOR_TOKEN, multiple: true });
}

export function SensorService() {
  return Service({ id: SENSOR_TOKEN, multiple: true });
}

export function LogicService() {
  return Service({ id: LOGIC_TOKEN, multiple: true });
}
