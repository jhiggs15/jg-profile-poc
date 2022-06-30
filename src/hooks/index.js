import { useState, useEffect } from "react";

const useLocalStorage = (key, fallbackValue) => {
  let storedData = localStorage.getItem(key);
  storedData = JSON.parse(storedData);
  const [value, updateValue] = useState(storedData ?? fallbackValue);
  useEffect(() => {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  }, [value, key]);

  return [value, updateValue];
};

export { useLocalStorage };
