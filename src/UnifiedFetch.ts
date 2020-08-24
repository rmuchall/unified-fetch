import {InstanceOptions} from "./interfaces/InstanceOptions";
import {UnifiedResponse} from "./interfaces/UnifiedResponse";
import {getGlobal} from "./utilities/get-global";

export class UnifiedFetch {
    private instanceOptions?: InstanceOptions;
    private global: WindowOrWorkerGlobalScope;

    constructor(instanceOptions?: InstanceOptions) {
        if (instanceOptions) {
            this.instanceOptions = instanceOptions;
        }

        this.global = getGlobal();
    }

    fetch(input: RequestInfo, init?: RequestInit): UnifiedResponse {
        const responsePromise = global.fetch(input, init);
        (responsePromise as UnifiedResponse).json = async () => (await responsePromise).json();
        return responsePromise as UnifiedResponse;
    }
}
