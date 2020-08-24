import {InstanceOptions} from "./interfaces/InstanceOptions";

export class UnifiedFetch {
    instanceOptions?: InstanceOptions;

    constructor(instanceOptions?: InstanceOptions) {
        if (instanceOptions) {
            this.instanceOptions = instanceOptions;
        }
    }

    async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
        return fetch(input, init);
    }
}
