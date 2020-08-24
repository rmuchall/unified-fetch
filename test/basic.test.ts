import {UnifiedFetch} from "../src/nodejs";

test("basic", async () => {
    const uniFetch = new UnifiedFetch();
    const result = await uniFetch.fetch("https://httpbin.org/post", {method: "POST", body: "a=1"}).json();
    console.log(result);
    expect(true).toBeTruthy();
});
