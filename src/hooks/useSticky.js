import { useCallback, useEffect, useRef, useState } from "react";

export default function Sticky() {
  const [isSticky, setSticky] = useState(false);
  const [previousScrollPosition, setScrollPosition] = useState(0);

  const element = useRef(null);

  const memoizedHandleScroll = useCallback(() => {
    let currentScrolledPosition = window.scrollY || window.pageYOffset;
    let scrollingDown;
    if (currentScrolledPosition >= previousScrollPosition) {
      scrollingDown = true;
    } else {
      scrollingDown = false;
    }
    setScrollPosition(currentScrolledPosition);
    if (element && element.current && element.current.getBoundingClientRect()) {
      setSticky(
        currentScrolledPosition >
          element.current.getBoundingClientRect().bottom && !scrollingDown
      );
    }
  }, [previousScrollPosition]);

  const debounce = useCallback((func, wait = 500, immediate = true) => {
    let timeOut;
    return () => {
      let context = this,
        args = arguments;
      const later = () => {
        timeOut = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeOut;
      clearTimeout(timeOut);
      timeOut = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", debounce(memoizedHandleScroll));
    return () => {
      window.removeEventListener("scroll", () => memoizedHandleScroll);
    };
  }, [debounce, memoizedHandleScroll]);

  return { isSticky, element };
}
