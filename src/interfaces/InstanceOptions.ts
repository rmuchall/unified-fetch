import {AfterResponseHook, BeforeRequestHook} from "../utilities/type-aliases";

export interface InstanceOptions {
    prefixUrl?: string;
    jwtToken?: string;
    beforeRequestHook?: BeforeRequestHook;
    afterResponseHook?: AfterResponseHook;
    headers?: HeadersInit;
}
