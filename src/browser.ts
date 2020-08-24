import {fetch as whatwgFetch} from "whatwg-fetch";

if (!window.fetch) {
    window.fetch =  whatwgFetch;
}

// core
export * from "./UnifiedFetch";
// interfaces
export * from "./interfaces/InstanceOptions";
export * from "./interfaces/RequestOptions";
// utilities
export * from "./utilities/hooks";
