import nodeFetch from "node-fetch";

if (!global.fetch) {
    console.log("Adding nodeFetch to global");
    global.fetch = nodeFetch;
}
