import {InstanceOptions} from "./interfaces/InstanceOptions";
import {ResponsePromise} from "./interfaces/ResponsePromise";
import {RequestOptions} from "./interfaces/RequestOptions";

export class UnifiedFetch {
    private instanceOptions?: InstanceOptions;

    constructor(instanceOptions?: InstanceOptions) {
        if (instanceOptions) {
            this.instanceOptions = instanceOptions;
        }
    }

    fetch(request: RequestInfo, options?: RequestOptions): ResponsePromise {
        if (this.instanceOptions?.beforeRequestHook) {
             this.instanceOptions.beforeRequestHook(request, options);
        }

        const responsePromise = fetch(request, options)
            .then(response => {
                if (this.instanceOptions?.afterResponseHook) {
                    return this.instanceOptions.afterResponseHook(response.clone(), request, options);
                }

                return response;
            });

        (responsePromise as ResponsePromise).json = async () => (await responsePromise).json();
        return responsePromise as ResponsePromise;
    }
}
