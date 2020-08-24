import {AfterResponseHook, BeforeRequestHook} from "../utilities/hooks";

export interface InstanceOptions {
    prefixUrl?: string;
    beforeRequestHook?: BeforeRequestHook;
    afterResponseHook?: AfterResponseHook;
}
