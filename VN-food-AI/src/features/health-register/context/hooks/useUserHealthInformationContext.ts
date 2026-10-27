import { useCallback, useRef } from "react";

export interface UseUserHealthInformationContextOptions {
  totalSteps: number;
  onAllReady?: () => void;
}

export const useUserHealthInformation = ({
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
