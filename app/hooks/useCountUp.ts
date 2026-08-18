"use client";

import { useState, useEffect, useRef } from "react";

export function useCountUp(target: number, duration: number = 600) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    const startValue = 0;
    const startTime = performance.now();
    const from = startValue;
    const to = target;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(from + (to - from) * progress);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    prevTarget.current = target;
    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}