import { MetabolismRequest } from "@/api/generated/model";
import { createContext, ReactNode, useContext } from "react";
import { MetabolismFieldData } from "../types/metabolism";
import { useUserHealthInformation } from "./hooks/useUserHealthInformationContext";

type UserHealthInformationContextContent = {
  metabolismData: MetabolismRequest | null;
  markReady: (name: string) => void;
  assignMetabolismFieldData: (fieldData: MetabolismFieldData) => void;
};

export const UserHealthInformationContext =
  createContext<UserHealthInformationContextContent>({
    metabolismData: null,
    markReady: () => {},
    assignMetabolismFieldData: () => {},
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
  const { metabolismData, markReady, assignMetabolismFieldData } =
    useUserHealthInformation({
      totalSteps,
      onAllReady,
    });

  return (
    <UserHealthInformationContext.Provider
      value={{ metabolismData, markReady, assignMetabolismFieldData }}>
      {children}
    </UserHealthInformationContext.Provider>
  );
}

export const useUserHealthInformationContext = () => {
  const ctx = useContext(UserHealthInformationContext);

  const { markReady, assignMetabolismFieldData, metabolismData } = ctx;
  return { markReady, assignMetabolismFieldData, metabolismData };
};
