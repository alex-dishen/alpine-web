import { useEffect, useRef } from 'react';

type ScrollShadowsProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export const ScrollShadows = ({ containerRef }: ScrollShadowsProps) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;

    if (!container || !left || !right) return;

    const update = () => {
      const canScrollLeft = container.scrollLeft > 0;
      const canScrollRight =
        container.scrollLeft + container.clientWidth <
        container.scrollWidth - 1;

      left.style.opacity = canScrollLeft ? '1' : '0';
      right.style.opacity = canScrollRight ? '1' : '0';
    };

    update();

    container.addEventListener('scroll', update, { passive: true });

    // Observe container resize and scrollable content resize (e.g. column resize)
    const observer = new ResizeObserver(update);
    observer.observe(container);

    for (const child of container.children) {
      observer.observe(child);
    }

    return () => {
      container.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [containerRef]);

  return (
    <>
      <div
        ref={leftRef}
        className="from-background pointer-events-none absolute top-0 left-0 z-20 h-full w-10 bg-gradient-to-r to-transparent transition-opacity duration-200"
        style={{ opacity: 0 }}
      />
      <div
        ref={rightRef}
        className="from-background pointer-events-none absolute top-0 right-0 z-20 h-full w-10 bg-gradient-to-l to-transparent transition-opacity duration-200"
        style={{ opacity: 0 }}
      />
    </>
  );
};
