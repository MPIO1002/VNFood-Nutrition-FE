import { useCallback, useContext, useRef } from "react";
import { UserHealthInformationContext } from "./context";

export interface UseUserHealthInformationContextOptions {
  totalSteps: number;
  onAllReady?: () => void;
}

export const useUserHealthInformationContext = ({
  totalSteps,
  onAllReady,
}: UseUserHealthInformationContextOptions) => {
  const readySteps = useRef<Set<string>>(new Set<string>());
  const markReady = useCallback(
    (name: string) => {
      readySteps.current.add(name);
      if (readySteps.current.size === totalSteps) onAllReady?.();
    },
    [totalSteps],
  );

  return {
    markReady,
  };
};

export const useUserHealthInformationContextController = () => {
  const ctx = useContext(UserHealthInformationContext);

  const { markReady } = ctx;
  return { markReady };
};
