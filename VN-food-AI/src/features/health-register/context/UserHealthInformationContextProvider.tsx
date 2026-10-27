import { ReactNode, useContext } from "react";
import { useUserHealthInformation } from "./hooks/useUserHealthInformationContext";

import { createContext } from "react";

type UserHealthInformationContextContent = {
  markReady: (name: string) => void;
};
export const UserHealthInformationContext =
  createContext<UserHealthInformationContextContent>({
    markReady: () => {},
  });

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
  const { markReady } = useUserHealthInformation({
    totalSteps,
    onAllReady,
  });

  return (
    <UserHealthInformationContext.Provider value={{ markReady }}>
      {children}
    </UserHealthInformationContext.Provider>
  );
}

export const useUserHealthInformationContext = () => {
  const ctx = useContext(UserHealthInformationContext);

  const { markReady } = ctx;
  return { markReady };
};
