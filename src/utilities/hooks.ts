import {RequestOptions} from "../interfaces/RequestOptions";

export type BeforeRequestHook = (request: RequestInfo, options?: RequestOptions) => void;
export type AfterResponseHook = (response: Response, request: RequestInfo, options?: RequestOptions) => Promise<Response>;
