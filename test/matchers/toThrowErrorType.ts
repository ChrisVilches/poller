/* eslint-disable @typescript-eslint/no-namespace */

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * This matcher makes sure a function throws an error with the type specified.
       * The built-in toThrow() doesn't work as expected, so this was created.
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
      hasError = e instanceof type;
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
