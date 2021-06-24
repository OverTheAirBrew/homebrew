// import * as sinon from 'sinon';
// import { expect } from 'chai';

// import { createHeaterValidator } from '../../../../app/lib/peripherals/validation';
// import { ValidationResult } from 'fluent-ts-validator';

// import * as Repository from '../../../../app/lib/peripherals/repository';
// import {
//   createHeater,
//   getHeaterById,
//   getHeaters,
// } from '../../../../app/lib/peripherals/heaters';

// describe('lib/peripherals/heaters', () => {
//   afterEach(() => {
//     sinon.restore();
//   });

//   describe('getHeaterById', () => {
//     let getHeaterStub: sinon.SinonStub;

//     beforeEach(() => {
//       getHeaterStub = sinon
//         .stub(Repository, 'getPeripheralByTypeAndId')
//         .resolves({
//           id: 'id',
//           name: 'name',
//           communicationType: 'gpio',
//           type: 'heater',
//           gpio: 1,
//         });
//     });

//     it('should return a mapped heater', async () => {
//       const response = await getHeaterById('id');

//       expect(response).to.deep.eq({
//         id: 'id',
//         name: 'name',
//         communicationType: 'gpio',
//         type: 'heater',
//         gpio: 1,
//       });
//     });
//   });

//   describe('getHeaters', () => {
//     let getHeatersStub: sinon.SinonStub;

//     beforeEach(() => {
//       getHeatersStub = sinon
//         .stub(Repository, 'getPeripheralsOfType')
//         .withArgs('heater')
//         .resolves([
//           {
//             id: 'id',
//             name: 'name',
//             communicationType: 'gpio',
//             type: 'heater',
//             gpio: 1,
//           },
//         ]);
//     });

//     it('should correctly map the heaters', async () => {
//       const response = await getHeaters();

//       expect(response).to.deep.eq([
//         {
//           id: 'id',
//           name: 'name',
//           communicationType: 'gpio',
//           type: 'heater',
//           gpio: 1,
//         },
//       ]);
//     });
//   });

//   describe('createHeater', () => {
//     let createHeaterValidatorStub: sinon.SinonStub;
//     let createPeripheralStub: sinon.SinonStub;

//     beforeEach(() => {
//       createHeaterValidatorStub = sinon
//         .stub(createHeaterValidator, 'validateAsync')
//         .resolves(new ValidationResult());

//       createPeripheralStub = sinon
//         .stub(Repository, 'createPeripheral')
//         .resolves('id');
//     });

//     it('should call to save the peripheral if the object validates', async () => {
//       await createHeater({ communicationType: 'gpio', gpio: 1, name: 'test' });
//       expect(createPeripheralStub.callCount).to.eq(1);
//     });

//     it('should not call the repository if the peripheral fails to validate', async () => {
//       createHeaterValidatorStub.reset();

//       const validationResult = new ValidationResult();
//       validationResult.addFailures([
//         {
//           attemptedValue: undefined,
//           code: 'code',
//           message: 'message',
//           propertyName: 'propertyName',
//           severity: 'severity',
//           target: 'target',
//         },
//       ]);

//       createHeaterValidatorStub.resolves(validationResult);

//       try {
//         await createHeater({
//           communicationType: 'gpio',
//           gpio: 1,
//           name: 'test',
//         });
//         expect.fail('we expected an error to be thrown');
//       } catch (err) {
//         expect(createPeripheralStub.callCount).to.eq(0);
//       }
//     });
//   });
// });
