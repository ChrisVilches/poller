/* eslint-disable @typescript-eslint/no-namespace */

import { isArrayOf } from "@util/misc";

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * This matcher makes sure a function throws an error with the type specified.
       * The built-in toThrow() doesn't work as expected, so this was created.
       *
       * @todo For now, this also works when the function throws an array of errors
       * of the specified type (in the future, it should be a separate matcher).
       */
      toThrowErrorType(type: any): R;
    }
  }
}

expect.extend({
  async toThrowErrorType(received: () => any, type: any) {
    let hasError = false;
    try {
      await received();
    } catch (e) {
      // TODO: This should be a separate matcher. Something like "toThrowArrayOfType"
      if (e instanceof type || isArrayOf(e, type)) {
        hasError = true;
      }
    }

    if (hasError) {
      return {
        message: () => `expected callback not to throw ${type.name}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected callback to throw ${type.name}`,
        pass: false,
      };
    }
  },
});
