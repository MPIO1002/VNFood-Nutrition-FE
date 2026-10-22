import { useCallback, useContext, useRef, useState } from "react";
import {
  defaultUserHealthData,
  UserHealthData,
  UserHealthInformationContext,
} from "./context";

export interface UseUserHealthInformationContextOptions {
  totalSteps: number;
  onAllReady?: () => void;
}

export const useUserHealthInformationContext = ({
  totalSteps,
  onAllReady,
}: UseUserHealthInformationContextOptions) => {
  const readySteps = useRef<Set<string>>(new Set<string>());
  const [data, setData] = useState<UserHealthData>(defaultUserHealthData);

  const markReady = useCallback(
    (name: string) => {
      readySteps.current.add(name);
      if (readySteps.current.size === totalSteps) onAllReady?.();
    },
    [totalSteps, onAllReady],
  );

  const updateData = useCallback((partial: Partial<UserHealthData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  return {
    markReady,
    data,
    updateData,
  };
};

export const useUserHealthInformationContextController = () => {
  const ctx = useContext(UserHealthInformationContext);
  return ctx;
};
