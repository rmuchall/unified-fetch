import nodeFetch from "node-fetch";

// https://github.com/node-fetch/node-fetch/tree/3.x#custom-highwatermark
global.fetch = (input: RequestInfo, init?: RequestInit) => nodeFetch(input as any, {...init as any, ...{ highWaterMark: 10 }}) as unknown as Promise<Response>;
global.Headers = nodeFetch.Headers as any;
global.Request = nodeFetch.Request as any;
global.Response = nodeFetch.Response as any;

/*
global.AbortController = ? // Requires another shim - not included (yet)
global.ReadableStream = ?  // Requires another shim - not included (yet)
*/

// core
export * from "./UnifiedFetch";
// interfaces
export * from "./interfaces/InstanceOptions";
export * from "./interfaces/RequestOptions";
// utilities
export * from "./utilities/type-aliases";
