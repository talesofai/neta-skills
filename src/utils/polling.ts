export const polling = async <T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean | Promise<boolean>,
  interval: number = 2000,
  timeout: number = 10 * 60 * 1000,
): Promise<
  | {
      result: T;
      isTimeout: false;
    }
  | {
      result: null;
      isTimeout: true;
    }
> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const result = await fn();
    if (await condition(result)) {
      return {
        result,
        isTimeout: false,
      };
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return {
    result: null,
    isTimeout: true,
  };
};
