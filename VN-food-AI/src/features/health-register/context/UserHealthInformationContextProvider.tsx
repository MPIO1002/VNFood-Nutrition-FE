import { MetabolismRequest } from "@/api/generated/model";
import { createContext, ReactNode, useContext } from "react";
import { HealthSteps } from "../constant/register";
import { MetabolismFieldData } from "../types/metabolism";
import { useUserHealthInformation } from "./hooks/useUserHealthInformationContext";

type UserHealthInformationContextContent = {
  metabolismData: MetabolismRequest | null;
  markReady: (name: HealthSteps) => void;
  assignMetabolismFieldData: (fieldData: MetabolismFieldData) => void;
  assginMultipleMetabolismFieldData: (obj: Partial<MetabolismRequest>) => void;
};

export const UserHealthInformationContext =
  createContext<UserHealthInformationContextContent>({
    metabolismData: null,
    markReady: () => {},
    assignMetabolismFieldData: () => {},
    assginMultipleMetabolismFieldData: () => {},
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
  const {
    metabolismData,
    markReady,
    assignMetabolismFieldData,
    assginMultipleMetabolismFieldData,
  } = useUserHealthInformation({
    totalSteps,
    onAllReady,
  });

  return (
    <UserHealthInformationContext.Provider
      value={{
        metabolismData,
        markReady,
        assignMetabolismFieldData,
        assginMultipleMetabolismFieldData,
      }}>
      {children}
    </UserHealthInformationContext.Provider>
  );
}

export const useUserHealthInformationContext = () => {
  const ctx = useContext(UserHealthInformationContext);

  const {
    markReady,
    assignMetabolismFieldData,
    metabolismData,
    assginMultipleMetabolismFieldData,
  } = ctx;
  return {
    markReady,
    assignMetabolismFieldData,
    metabolismData,
    assginMultipleMetabolismFieldData,
  };
};
