import { MetabolismRequest, MetabolismResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { profileQueryKeys } from "@/features/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useHealthRegisterMutation } from "./health-register.queries";

export const useHealthRegister = () => {
  const queryClient = useQueryClient();
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
            queryClient.invalidateQueries({
              queryKey: profileQueryKeys.current(),
            });
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
