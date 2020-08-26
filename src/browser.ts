import {fetch as whatwgFetch, Headers as whatwgHeaders, Request as whatwgRequest, Response as whatwgResponse} from "whatwg-fetch";

if (!window.fetch) {
    window.fetch =  whatwgFetch;
}

if (!global.Headers) {
    global.Headers = whatwgHeaders;
}

if (!global.Request) {
    global.Request = whatwgRequest;
}

if (!global.Response) {
    global.Response = whatwgResponse;
}

/*
if (!global.AbortController) {
    // Requires another shim - not included (yet)
}

if (!global.ReadableStream) {
    // Requires another shim - not included (yet)
}
*/

// core
export * from "./UnifiedFetch";
// interfaces
export * from "./interfaces/InstanceOptions";
export * from "./interfaces/RequestOptions";
export * from "./interfaces/ResponsePromise";
// utilities
export * from "./utilities/string-utils";
export * from "./utilities/type-aliases";
