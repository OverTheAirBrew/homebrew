import { expect } from 'chai';
import { createValidationErrorWithConfigError } from '../../../../src/lib/errors/create-validation-error-with-config-error';

describe('lib/errors/create-validation-error-with-config-error', () => {
  it('should not append config invalid if its not', async () => {
    const response = await createValidationErrorWithConfigError([], true, {});

    expect(response.failures.length).to.eq(0);
  });

  it('should append a config error if its invalid', async () => {
    const response = await createValidationErrorWithConfigError([], false, {});
    expect(response.failures.length).to.eq(1);

    expect(response.failures.some((f) => f.code === 'CONFIG_INVALID')).to.be
      .true;
  });
});
