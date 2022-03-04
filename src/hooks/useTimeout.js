import { useEffect, useRef } from "react";

export default function useTimeout(callback, delay) {
  const savedCallback = useRef();
  const savedDelay = useRef();

  // Remember the latest callback and delay.
  useEffect(() => {
    savedCallback.current = callback;
    savedDelay.current = delay;
  }, [callback, delay]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}
