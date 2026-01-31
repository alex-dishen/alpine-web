import { useEffect, useRef } from 'react';

export const useTraceUpdate = <T extends Record<string, unknown>>(props: T) => {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps: Record<string, [unknown, unknown]> = {};

    for (const [k, v] of Object.entries(props)) {
      if (prev.current[k] !== v) {
        changedProps[k] = [prev.current[k], v];
      }
    }

    if (Object.keys(changedProps).length > 0) {
      // eslint-disable-next-line no-console
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
};
