import {InstanceOptions} from "./interfaces/InstanceOptions";
import {ResponsePromise} from "./interfaces/ResponsePromise";
import {RequestOptions} from "./interfaces/RequestOptions";
import {stripDuplicateSlashes} from "./utilities/string-utils";
import {HeadersInitOrUndefined} from "./utilities/type-aliases";

export class UnifiedFetch {
    private instanceOptions?: InstanceOptions;

    constructor(instanceOptions?: InstanceOptions) {
        if (instanceOptions) {
            this.instanceOptions = instanceOptions;
        }
    }

    buildRequestInit(userRequestOptions?: RequestOptions): RequestInit {
        // Exclude UnifiedFetch specific options and extract headers
        const {json, headers, ...userRequestOptionsDestructured} = {...userRequestOptions};
        const requestInit: RequestInit = {...userRequestOptionsDestructured};

        // Normalize method case
        requestInit.method = requestInit.method?.toUpperCase();

        // Merge headers
        requestInit.headers = this.mergeHeaders(this.instanceOptions?.headers, headers);

        // UnifiedFetch json option
        if (json) {
            requestInit.headers.append("Content-Type", "application/json");
            requestInit.body = JSON.stringify(json);
        }

        return requestInit;
    }

    mergeHeaders(...sources: HeadersInitOrUndefined[]): Headers {
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

    fetch(input: RequestInfo, init?: RequestOptions): ResponsePromise {
        const requestInit = this.buildRequestInit(init);

        // prefixUrl?
        if (this.instanceOptions?.prefixUrl) {
            const requestUrl = stripDuplicateSlashes(`${this.instanceOptions.prefixUrl}${input}`);
            if (typeof input === "string") {
                input = requestUrl;
            }
        }

        // beforeRequestHook
        if (this.instanceOptions?.beforeRequestHook) {
            this.instanceOptions.beforeRequestHook(input, requestInit);
        }

        const responsePromise = fetch(input, requestInit)
            .then(response => {
                // afterRequestHook
                if (this.instanceOptions?.afterResponseHook) {
                    return this.instanceOptions.afterResponseHook(response.clone(), input, requestInit);
                }

                return response;
            });

        // Add extension methods
        (responsePromise as ResponsePromise).arrayBuffer = async () => (await responsePromise).arrayBuffer();
        (responsePromise as ResponsePromise).blob = async () => (await responsePromise).blob();
        (responsePromise as ResponsePromise).formData = async () => (await responsePromise).formData(); // Not implemented in node-fetch
        (responsePromise as ResponsePromise).json = async () => (await responsePromise).json();
        (responsePromise as ResponsePromise).text = async () => (await responsePromise).text();
        return responsePromise as ResponsePromise;
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
}