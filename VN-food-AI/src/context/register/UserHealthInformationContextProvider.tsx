import { ReactNode } from "react";
import { UserHealthInformationContext } from "./hooks/context";
import { useUserHealthInformationContext } from "./hooks/useUserHealthInformationContext";

export interface UserHealthInformationContextProviderProps {
  children?: ReactNode;
  totalSteps: number;
  onAllReady?: () => void;
}

export default function UserHealthInformationContextProvider({
  children,
  totalSteps,
  onAllReady,
}: UserHealthInformationContextProviderProps) {
  const { markReady } = useUserHealthInformationContext({
    totalSteps,
    onAllReady,
  });

  return (
    <UserHealthInformationContext.Provider value={{ markReady }}>
      {children}
    </UserHealthInformationContext.Provider>
  );
}
