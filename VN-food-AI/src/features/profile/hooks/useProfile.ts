import {
  HTTPValidationError,
  ImageUploadResponse,
  ProfileResponse,
  ProfileUpdateRequest,
} from "@/api/generated/model";
import { ErrorType } from "@/api/mutator/axios-instance";
import { APIMutatorOptions } from "@/api/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { useCallback } from "react";
import {
  profileQueryKeys,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from "./profile.queries";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfileMutation();
  const uploadImage = useUploadProfileImageMutation();

  const handleUpdateProfile = useCallback(
    (
      data: ProfileUpdateRequest,
      options?: APIMutatorOptions<ProfileResponse, ProfileUpdateRequest>,
    ) => {
      updateProfile.mutate(
        {
          data: data,
        },
        {
          onSuccess: (res: ProfileResponse) => {
            queryClient.invalidateQueries({
              queryKey: profileQueryKeys.current(),
            });
            options?.onSuccess?.(res);
          },
          onError: (e) => {
            options?.onError?.(e);
          },
          onSettled: (res, e, req) => {
            options?.onSettled?.(res, e, { ...req.data });
          },
        },
      );
    },
    [updateProfile],
  );

  const handleUploadAvatar = useCallback(
    async (
      asset: ImagePickerAsset,
      options?: APIMutatorOptions<ImageUploadResponse, ImagePickerAsset>,
    ) => {
      const img = {
        uri: asset.uri,
        name: asset.fileName || "profile-avatar.jpg",
        type: asset.mimeType || "image/jpeg",
      } as unknown as Blob;

      let uploadedRes: ImageUploadResponse | undefined;
      let error: ErrorType<HTTPValidationError> | null = null;

      try {
        uploadedRes = await uploadImage.mutateAsync({
          data: {
            image: img,
          },
        });
        options?.onSuccess?.(uploadedRes);
      } catch (e) {
        error = isAxiosError<HTTPValidationError>(e) ? e : null;
        if (error) options?.onError?.(error);
        else console.log(e);
      } finally {
        options?.onSettled?.(uploadedRes, error, asset);
      }
    },
    [uploadImage],
  );

  return { handleUpdateProfile, handleUploadAvatar };
};
