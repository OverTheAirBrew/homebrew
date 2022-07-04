export module ActorStateChanged {
  export const EventName = 'actors.actor.state-changed';
  export interface Data {
    actor_id: string;
    state: 'on' | 'off';
  }
  export const Data: Data = {} as any;
}
