export module ActorStateChanged {
  export const Topic = 'actors.actor.state-changed';
  export interface Data {
    actor_id: string;
    state: 'on' | 'off';
  }
  export const Data: Data = {} as any;
}
