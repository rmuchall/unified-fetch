import {fetch as whatwgFetch} from "whatwg-fetch";

if (!window.fetch) {
    console.log("Adding whatwgFetch to window");
    window.fetch = whatwgFetch;
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
