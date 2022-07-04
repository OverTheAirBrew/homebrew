import { nullIfEmpty } from './utils';

describe('lib/utils', () => {
  describe('nullIfEmpty', () => {
    it('should return null if the string is empty', async () => {
      const result = await nullIfEmpty('');
      expect(result).toBeNull;
    });
  });
});
