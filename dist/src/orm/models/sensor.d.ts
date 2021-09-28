import { BaseModel } from '../base-model';
export interface ISensor {
    id?: string;
    name: string;
    type_id: string;
    config: any;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
export default class Sensor extends BaseModel<ISensor> {
    id?: string;
    name: string;
    type_id: string;
    config: any;
    createdAt?: Date;
    updatedAt?: Date;
}
