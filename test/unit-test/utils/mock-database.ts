import sinon from 'ts-sinon';
import * as typeorm from 'typeorm';

export function mockDatabase() {
  sinon.stub(typeorm, 'createConnection').resolves({} as any);
  sinon.stub(typeorm.ConnectionManager.prototype, 'has').returns(true);
  sinon.stub(typeorm.ConnectionManager.prototype, 'get').returns({
    getRepository: () => {
      // console.warn('No mock repository found');
    },
    getTreeRepository: () => {
      // console.warn('No mock repository found');
    },
    getCustomRepository: () => {
      // console.warn('No mock repository found');
    },
  } as any);
}
