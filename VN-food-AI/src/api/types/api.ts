import { HTTPValidationError } from "../generated/model";
import { ErrorType } from "../mutator/axios-instance";

export interface APIMutatorOptions<TResponse, TRequest> {
  onSuccess?: (res: TResponse) => void;
  onError?: (e: ErrorType<HTTPValidationError>) => void;
  onSettled?: (
    res: TResponse | undefined,
    e: ErrorType<HTTPValidationError> | null,
    req: TRequest,
  ) => void;
}
