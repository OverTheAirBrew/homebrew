export class ActorStateChanged {
  static Channel = 'ActorStateChanged';

  constructor(public actor_id: string, public state: 'on' | 'off') {}
}
