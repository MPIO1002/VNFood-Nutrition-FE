import { HTTPValidationError } from "../generated/model";
import { ErrorType } from "../mutator/axios-instance";

export interface APIMutatorOptions<TResponse> {
  onSuccess?: (res: TResponse) => void;
  onError?: (e: ErrorType<HTTPValidationError>) => void;
}
