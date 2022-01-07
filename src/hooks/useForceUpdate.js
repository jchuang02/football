import { useState } from "react";

export default function useForceUpdate() {
  const [value, setValue] = useState(0);
  console.log(value);
  return () => setValue((value) => value + 1);
}
