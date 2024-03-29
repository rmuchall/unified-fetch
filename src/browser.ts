import {fetch as whatwgFetch, Headers as whatwgHeaders, Request as whatwgRequest, Response as whatwgResponse} from "whatwg-fetch";
import {isBrowser} from "./utilities/detect-environment";

// Service workers don't have a window.
// This way it should work for both browsers and service workers.
if (isBrowser()) {
    if (!window.fetch) {
        window.fetch = whatwgFetch;
    }

    if (!window.Headers) {
        window.Headers = whatwgHeaders;
    }

    if (!window.Request) {
        window.Request = whatwgRequest;
    }

    if (!window.Response) {
        window.Response = whatwgResponse;
    }

    /*
    if (!window.AbortController) {
        // Requires another shim - not included (yet)
    }

    if (!window.ReadableStream) {
        // Requires another shim - not included (yet)
    }
    */
}

// core
export * from "./UnifiedFetch";
// interfaces
export * from "./interfaces/InstanceOptions";
export * from "./interfaces/RequestOptions";
// utilities
export * from "./utilities/type-aliases";
