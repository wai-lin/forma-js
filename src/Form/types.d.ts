export type Method = "get" | "post" | "put" | "delete" | "patch" | "graphql";

export type EncType =
  | "multipart/form-data"
  | "application/json"
  | "application/x-www-form-urlencoded";

export type TransitionState = "idle" | "submitting" | "error" | "catch-error";

export interface Transition {
  state: TransitionState;
  formData: FormData;
}

export type ResponseParam<DataType> = Response & { data: DataType };

export type LifeCycleFuncs<DataType, ErrorType> = {
  /**
   * Called right before making fetch request, after generating request init.
   * RequestInit object is passed as argument so that it can be modified before
   * making the request. All the options except `signal` is mutable for the RequestInit.
   */
  beforeRequest?: (init: Omit<RequestInit, "signal">) => void;
  /**
   * Called after fetch request whether it's `failed` or `success`.
   * Cannot access to any object.
   */
  afterRequest?: () => void;
  /**
   * Called when `response.ok` is `true`.
   * Response object is passed as argument.
   */
  onSuccess?: (res: ResponseParam<DataType>) => void;
  /**
   * Called when `response.ok` is `false`.
   * Response object is passed as argument.
   */
  onError?: (res: ResponseParam<ErrorType>) => void;
  /**
   * Called on catch handler.
   * Error object is passed as argument.
   */
  onCatchError?: (e: any) => void;
  /**
   * Called after fetch request is aborted.
   * Cannot access to any object.
   */
  afterAbort?: () => void;
};
