import {AfterResponseHook, BeforeRequestHook} from "../utilities/type-aliases";

export interface InstanceOptions {
    prefixUrl?: string;
    beforeRequestHook?: BeforeRequestHook;
    afterResponseHook?: AfterResponseHook;
    headers?: HeadersInit;
}
