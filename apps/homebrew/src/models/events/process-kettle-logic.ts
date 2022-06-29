export class ProcessKettleLogic<T> {
  static Channel = Symbol('ProcessKettleLogicEvent');

  constructor(
    public kettle_id: string,
    public logicType: string,
    public config: T,
    public run_id: string,
  ) {}
}
