import { Actor as ActorType } from '@overtheairbrew/homebrew-plugin';
import { Logger } from '../logger';
import { Peripheral, PeripheralDto } from '../models/peripheral';
import { PeripheralsRepository } from './repository';
import { PeripheralsValidator } from './validation';
export declare class PeripheralService {
    private actors;
    private logger;
    private validator;
    private repository;
    constructor(actors: ActorType[], logger: Logger, validator: PeripheralsValidator, repository: PeripheralsRepository);
    private getPeripheralImplementation;
    createPeripheral(peripheral: Peripheral): Promise<string>;
    getPeripherals(): Promise<PeripheralDto[]>;
    getPeripheralById(peripheral_id: string): Promise<PeripheralDto>;
    private mapPeripheral;
}
