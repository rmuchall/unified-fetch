import nodeFetch from "node-fetch";
import {fetch as whatwgFetch} from "whatwg-fetch";

declare global {
    const fetch: nodeFetch | whatwgFetch;
    // Environment dependent
    const navigator: any;
    const self: any;
    const window: any;
}
