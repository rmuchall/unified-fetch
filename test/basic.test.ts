import {UnifiedFetch} from "../src/nodejs";

test("basic", async () => {
    const uniFetch = new UnifiedFetch({
        beforeRequestHook: (request, options) => {
            (options as any).rsm = "modified request options";
            console.log("Inside beforeRequestHook()");
        },
        afterResponseHook: (response, request, options) => {
            console.log("Inside afterResponseHook()");
            console.log((options as any).rsm);
            (response as any).rsm = "modified response";

            return Promise.resolve(response);
        }
    });
    const response = await uniFetch.fetch("https://httpbin.org/post", {method: "POST", body: "a=1"});
    console.log((response as any).rsm);
    console.log(await response.json());
    expect(true).toBeTruthy();
});
