import nodeFetch from "node-fetch";

if (!global.fetch) {
    // https://github.com/node-fetch/node-fetch/tree/3.x#custom-highwatermark
    global.fetch = (input: RequestInfo, init?: RequestInit) =>
        nodeFetch(input as any, {...init as any, ...{ highWaterMark: 10 }});
}

// core
export * from "./UnifiedFetch";
// interfaces
export * from "./interfaces/InstanceOptions";
export * from "./interfaces/RequestOptions";
export * from "./interfaces/ResponsePromise";
// utilities
export * from "./utilities/hooks";
