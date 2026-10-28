import { MetabolismRequest } from "@/api/generated/model";

export type MetabolismFieldData = {
  [K in keyof MetabolismRequest]: {
    field: K;
    value: MetabolismRequest[K];
  };
}[keyof MetabolismRequest];
