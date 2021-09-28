import { BaseModel } from '../base-model';
export interface IPeripheral {
    id?: string;
    name: string;
    type_id: string;
    config?: any;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
export default class Peripheral extends BaseModel<IPeripheral> {
    id?: string;
    name: string;
    type_id: string;
    config: string;
    createdAt?: Date;
    updatedAt?: Date;
}
