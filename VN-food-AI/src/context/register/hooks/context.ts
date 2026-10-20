import { createContext } from "react";

type UserHealthInformationContextContent = {
  markReady: (name: string) => void;
};
export const UserHealthInformationContext =
  createContext<UserHealthInformationContextContent>({
    markReady: () => {},
  });
