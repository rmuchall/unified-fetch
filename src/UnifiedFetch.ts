import {InstanceOptions} from "./interfaces/InstanceOptions";
import {ResponsePromise} from "./interfaces/ResponsePromise";
import {RequestOptions} from "./interfaces/RequestOptions";
import {HeadersInitOrUndefined} from "./utilities/type-aliases";

export class UnifiedFetch {
    private instanceOptions?: InstanceOptions;

    constructor(instanceOptions?: InstanceOptions) {
        if (instanceOptions) {
            this.instanceOptions = instanceOptions;
        }
    }

    private buildRequestInit(userRequestOptions?: RequestOptions): RequestInit {
        // Exclude UnifiedFetch specific options and extract headers
        const {json, headers, ...userRequestOptionsDestructured} = {...userRequestOptions};
        const requestInit: RequestInit = {...userRequestOptionsDestructured};

        // Normalize method case
        requestInit.method = requestInit.method?.toUpperCase();

        // Merge headers
        requestInit.headers = UnifiedFetch.mergeHeaders(this.instanceOptions?.headers, headers);

        // UnifiedFetch json option
        if (json) {
            requestInit.headers.append("Content-Type", "application/json");
            requestInit.body = JSON.stringify(json);
        }

        return requestInit;
    }

    private async performFetch(requestInfo: RequestInfo, requestInit: RequestInit): Promise<Response> {
        // beforeRequestHook
        if (this.instanceOptions?.beforeRequestHook) {
            await this.instanceOptions.beforeRequestHook(requestInfo, requestInit);
        }

        // Fetch
        let response = await fetch(requestInfo, requestInit);

        // afterResponseHook
        if (this.instanceOptions?.afterResponseHook) {
            response = await this.instanceOptions.afterResponseHook(response, requestInfo, requestInit);
        }

        return response;
    }

    fetch(input: RequestInfo, init?: RequestOptions): ResponsePromise {
        const requestInit = this.buildRequestInit(init);

        // prefixUrl?
        if (this.instanceOptions?.prefixUrl) {
            if (typeof input === "string") {
                // Normalize url
                input = `${this.instanceOptions.prefixUrl}/${input}`.replace(/([^:]\/)\/+/g, "$1");
            }
        }

        // Fetch
        const responsePromise = <ResponsePromise>this.performFetch(input, requestInit);

        // Add extension methods
        responsePromise.arrayBuffer = async () => (await responsePromise).arrayBuffer();
        responsePromise.blob = async () => (await responsePromise).blob();
        responsePromise.formData = async () => (await responsePromise).formData(); // Not implemented in node-fetch
        responsePromise.json = async () => (await responsePromise).json();
        responsePromise.text = async () => (await responsePromise).text();

        return responsePromise
    }

    // Add shortcuts
    get(request: RequestInfo, options?: RequestOptions): ResponsePromise {
        return this.fetch(request, {
            ...options,
            method: "GET"
        });
    }

    post(request: RequestInfo, options?: RequestOptions): ResponsePromise {
        return this.fetch(request, {
            ...options,
            method: "POST"
        });
    }

    put(request: RequestInfo, options?: RequestOptions): ResponsePromise {
        return this.fetch(request, {
            ...options,
            method: "PUT"
        });
    }

    delete(request: RequestInfo, options?: RequestOptions): ResponsePromise {
        return this.fetch(request, {
            ...options,
            method: "DELETE"
        });
    }

    static mergeHeaders(...sources: HeadersInitOrUndefined[]): Headers {
        const result = new Headers();

        for (const source of sources) {
            if (!source) {
                continue;
            }

            const headers = source.constructor === Headers ? source : new Headers(source);
            headers.forEach((value, key, parent) => {
                if (!value) {
                    result.delete(key);
                } else {
                    result.set(key, value);
                }
            });
        }

        return result;
    }
}
