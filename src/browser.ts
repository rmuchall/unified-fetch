// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-file
import whatwgFetch from "whatwg-fetch";

if (!window.fetch) {
    console.log("Adding whatwgFetch to window");
    window.fetch = whatwgFetch;
}
