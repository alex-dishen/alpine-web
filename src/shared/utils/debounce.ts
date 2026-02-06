type TimeoutId = ReturnType<typeof setTimeout>;

export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  let timeoutId: TimeoutId | undefined;

  const debounced = (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
};
