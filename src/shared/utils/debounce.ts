import type { MutableRefObject } from 'react';

let timerID: NodeJS.Timeout;

export const debounce = <T>(
  callback: (...args: T[]) => void,
  delay: number,
  timer?: MutableRefObject<NodeJS.Timeout | undefined>
) => {
  return ((...args: T[]) => {
    clearTimeout(timer?.current || timerID);

    if (timer) {
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);

      return;
    }

    timerID = setTimeout(() => {
      callback(...args);
    }, delay);
  })();
};
