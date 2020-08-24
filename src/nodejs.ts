import nodeFetch from "node-fetch";

if (!global.fetch) {
    console.log("Adding nodeFetch to global");
    global.fetch = nodeFetch;
}

// core
export * from "./UnifiedFetch";
// interfaces
export * from "./interfaces/InstanceOptions";
export * from "./interfaces/RequestOptions";
// utilities
export * from "./utilities/detect-environment";
export * from "./utilities/get-global";
export * from "./utilities/hooks";
