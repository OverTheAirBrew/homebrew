// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { Test } from '@nestjs/testing';
// import { SelectBoxProperty } from '@ota-internal/shared';
// import { Gpio } from 'onoff';
// import { GpioActor } from '.';

// jest.mock('onoff');

// describe('plugin/gpio', () => {
//   let service: GpioActor;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [GpioActor],
//       imports: [EventEmitterModule.forRoot()],
//     }).compile();

//     service = moduleRef.get(GpioActor);
//   });

//   it('should turn on when requested', async () => {
//     await service.on('test', { gpio: 10 });

//     expect(Gpio.prototype.constructor).toHaveBeenCalledWith(10, 'out');

//     expect(Gpio.prototype.writeSync).toHaveBeenCalled();
//     expect(Gpio.prototype.writeSync).toHaveBeenCalledWith(1);
//   });

//   it('should turn off when requested', async () => {
//     await service.off('test', { gpio: 10 });

//     expect(Gpio.prototype.constructor).toHaveBeenCalledWith(10, 'out');
//     expect(Gpio.prototype.writeSync).toHaveBeenCalledWith(0);
//   });

//   it('should return the properties', async () => {
//     const properties = service.properties;

//     const gpioNumberProperty = properties.find(
//       (prop) => prop.id === 'gpioNumber',
//     );

//     expect(gpioNumberProperty).toBeDefined();
//     expect(gpioNumberProperty.type).toBe('select-box');
//     expect(gpioNumberProperty.required).toBeTruthy();

//     const values = await (
//       gpioNumberProperty as SelectBoxProperty<number>
//     ).values();

//     const gpioNumberList = await generateArray(28);

//     for (const value of values) {
//       expect(gpioNumberList.indexOf(value)).toBeGreaterThan(-1);
//     }
//   });
// });

// async function generateArray(total: number): Promise<number[]> {
//   var arr: number[] = [];
//   for (var i = 1; i <= total; i++) {
//     arr.push(i);
//   }

//   return arr;
// }
