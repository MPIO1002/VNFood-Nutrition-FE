import { MetabolismRequest, MetabolismResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { createContext, ReactNode, RefObject, useContext } from "react";
import { HealthSteps } from "../constant/register";
import { MetabolismFieldData } from "../types/metabolism";
import { useUserHealthInformation } from "./hooks/useUserHealthInformationContext";

type UserHealthInformationContextContent = {
  metabolismData: RefObject<MetabolismRequest | null> | null;
  startLoading?: () => void;
  markReady: (name: HealthSteps) => void;
  assignMetabolismFieldData: (fieldData: MetabolismFieldData) => void;
  assginMultipleMetabolismFieldData: (obj: Partial<MetabolismRequest>) => void;
  submitMetabolismData: (arg?: {
    options?: APIMutatorOptions<MetabolismResponse, MetabolismRequest>;
  }) => void;
};

export const UserHealthInformationContext =
  createContext<UserHealthInformationContextContent>({
    metabolismData: null,
    markReady: () => {},
    assignMetabolismFieldData: () => {},
    assginMultipleMetabolismFieldData: () => {},
    submitMetabolismData: (_ = {}) => {},
  });

export interface UserHealthInformationContextProviderProps {
  children?: ReactNode;
  totalSteps: number;
  startLoading?: () => void;
  onLoadingProgressChange?: (progress: number) => void;
  onAllReady?: () => void;
}

export default function UserHealthInformationContextProvider({
  children,
  totalSteps,
  startLoading,
  onLoadingProgressChange,
  onAllReady,
}: UserHealthInformationContextProviderProps) {
  const {
    metabolismData,
    markReady,
    assignMetabolismFieldData,
    assginMultipleMetabolismFieldData,
    submitMetabolismData,
  } = useUserHealthInformation({
    totalSteps,
    onLoadingProgressChange,
    onAllReady,
  });

  return (
    <UserHealthInformationContext.Provider
      value={{
        metabolismData,
        startLoading,
        markReady,
        assignMetabolismFieldData,
        assginMultipleMetabolismFieldData,
        submitMetabolismData,
      }}>
      {children}
    </UserHealthInformationContext.Provider>
  );
}

export const useUserHealthInformationContext = () => {
  const ctx = useContext(UserHealthInformationContext);

  const {
    metabolismData,
    startLoading,
    markReady,
    assignMetabolismFieldData,
    assginMultipleMetabolismFieldData,
    submitMetabolismData,
  } = ctx;
  return {
    metabolismData,
    startLoading,
    markReady,
    assignMetabolismFieldData,
    assginMultipleMetabolismFieldData,
    submitMetabolismData,
  };
};
