"use client";
import { useEffect, useState } from "react";
import { storage } from "../utils/storage";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => storage.get<T>(key, initial));

  useEffect(() => {
    storage.set<T>(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
