import { PeripheralService } from '../lib/peripherals';
import { Peripheral, PeripheralDto } from '../lib/models/peripheral';
export declare class PeripheralsController {
    private peripheralService;
    constructor(peripheralService: PeripheralService);
    createHeater(body: Peripheral): Promise<{
        id: string;
    }>;
    getHeaters(): Promise<PeripheralDto[]>;
    getHeater(id: string): Promise<PeripheralDto>;
}
