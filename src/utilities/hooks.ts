import {RequestOptions} from "../interfaces/RequestOptions";

export type BeforeRequestHook = (request: RequestInfo, options: RequestOptions) => void;
export type AfterResponseHook = (request: RequestInfo, options: RequestOptions, response: Response) => Promise<Response>;
