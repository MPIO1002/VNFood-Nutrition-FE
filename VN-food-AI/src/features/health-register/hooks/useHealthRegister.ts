import { MetabolismRequest, MetabolismResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { useCallback } from "react";
import { useHealthRegisterMutation } from "./health-register.queries";

export const useHealthRegister = () => {
  const healthRegisterMutation = useHealthRegisterMutation();

  const handleHealthRegister = useCallback(
    ({
      data,
      options,
    }: {
      data: MetabolismRequest;
      options?: APIMutatorOptions<MetabolismResponse, MetabolismRequest>;
    }) => {
      healthRegisterMutation.mutate(
        { data },
        {
          onSuccess: (res: MetabolismResponse) => {
            // REMINDER: invalidate profile key here
            options?.onSuccess?.(res);
          },
          onError: (e) => {
            options?.onError?.(e);
          },
          onSettled: (res, e, v) => {
            options?.onSettled?.(res, e, { ...v.data });
          },
        },
      );
    },
    [healthRegisterMutation],
  );

  return { handleHealthRegister };
};
