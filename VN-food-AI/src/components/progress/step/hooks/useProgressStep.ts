import { useCallback, useState } from "react";

export function useProgressStep({ steps }: { steps: number }) {
  const [currentStep, setCurrentStep] = useState(0);

  const onNextStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps));
  }, [steps]);

  const onBackStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const setStep = useCallback(
    (step: number) => {
      if (step >= steps || step < 0) return;
      setCurrentStep(step);
    },
    [steps],
  );

  return { currentStep, onNextStep, onBackStep, setStep };
}
