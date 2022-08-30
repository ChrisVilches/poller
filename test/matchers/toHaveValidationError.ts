/* eslint-disable @typescript-eslint/no-namespace */

import { ValidationError } from 'class-validator';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveValidationError(): R;
    }
  }
}

expect.extend({
  async toHaveValidationError(received: () => any) {
    let hasError = false;
    try {
      await received();
    } catch (e) {
      hasError = e instanceof ValidationError;
    }

    if (hasError) {
      return {
        message: () => `expected callback not to have validation error`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected callback to have validation error`,
        pass: false,
      };
    }
  },
});
