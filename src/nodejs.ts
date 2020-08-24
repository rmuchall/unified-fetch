import nodeFetch from "node-fetch";

if (!global.fetch) {
    global.fetch = (input: RequestInfo, init?: RequestInit) => {
        // https://github.com/node-fetch/node-fetch/tree/3.x#custom-highwatermark
        return nodeFetch(input as any, {...init as any, ...{ highWaterMark: 10 }});
    };
}

if (!global.Headers) {
    global.Headers = nodeFetch.Headers;
}

if (!global.Request) {
    global.Request = nodeFetch.Request;
}

if (!global.Response) {
    global.Response = nodeFetch.Response;
}

if (!global.AbortController) {
    // AbortController can be shimmed but adds extra dependencies
    // Not implemented yet
}

if (!global.ReadableStream) {
    // ReadableStream cannot be shimmed in old browsers as it requires underlying engine functionality
    // Not implemented (and probably never will be)
}

// core
export * from "./UnifiedFetch";
// interfaces
export * from "./interfaces/InstanceOptions";
export * from "./interfaces/RequestOptions";
// utilities
export * from "./utilities/hooks";
