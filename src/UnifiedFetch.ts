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

        const fetchResponsePromise = fetch(request, options)
            .then(response => {
                if (this.instanceOptions?.afterResponseHook) {
                    return this.instanceOptions.afterResponseHook(response.clone(), request, options);
                }

                return response;
            });

        return {
            ...fetchResponsePromise,
            // Add extension methods
            arrayBuffer: async () => (await fetchResponsePromise).arrayBuffer(),
            blob: async () => (await fetchResponsePromise).blob(),
            formData: async () => (await fetchResponsePromise).formData(),
            json: async () => (await fetchResponsePromise).json(),
            text: async () => (await fetchResponsePromise).text()
        };
    }
}
