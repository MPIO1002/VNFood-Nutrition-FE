import { createContext } from "react";

export type GenderType = "male" | "female";

export type UserHealthData = {
  gender: GenderType;
  age: number;
  weight: number;
  height: number;
  activityLevel: number;
  activityId: string;
  plan: number;
};

export const defaultUserHealthData: UserHealthData = {
  gender: "male",
  age: 27,
  weight: 68.5,
  height: 175,
  activityLevel: 1.55,
  activityId: "moderate",
  plan: 2,
};

export type UserHealthInformationContextContent = {
  markReady: (name: string) => void;
  data: UserHealthData;
  updateData: (partial: Partial<UserHealthData>) => void;
};

export const UserHealthInformationContext =
  createContext<UserHealthInformationContextContent>({
    markReady: () => {},
    data: defaultUserHealthData,
    updateData: () => {},
  });
