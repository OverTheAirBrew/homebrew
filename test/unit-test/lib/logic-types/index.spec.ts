// import { expect } from 'chai';
// import { LogicTypeService } from '../../../../src/lib/logic-types';
// import { PropertyTypeMapper } from '../../../../src/lib/mappers/property-mapper';
// import { TestLogicType } from '../../../test-data/logic-types';

// describe('lib/logic-types', () => {
//   let logicTypeService: LogicTypeService;

//   beforeEach(() => {
//     logicTypeService = new LogicTypeService(
//       [new TestLogicType()],
//       new PropertyTypeMapper(),
//     );
//   });

//   it('should return the mapped types', async () => {
//     const response = await logicTypeService.getLogicTypes();

//     expect(response).to.deep.eq([
//       {
//         id: 'test-logic',
//         properties: [
//           {
//             type: 'string',
//             isRequired: true,
//             name: 'testingprop',
//             placeholder: 'data',
//           },
//         ],
//       },
//     ]);
//   });
// });
