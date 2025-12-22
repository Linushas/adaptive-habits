import { useState } from "react";

export function useFilter<T>() {
  const [selected, setSelected] = useState<T[]>([]);

  const reset = () => {
    setSelected([]);
  };

  const toggleItem = (item: T) => {
    if (selected.includes(item))
      setSelected(selected.filter((x) => x !== item));
    else setSelected(selected.concat(item));
  };

  const isToggled = (item: T) => {
    return selected.includes(item);
  };

  return [selected, setSelected, reset, toggleItem, isToggled] as const;
}
