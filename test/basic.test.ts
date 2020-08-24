import "../src/nodejs";
import {UnifiedFetch} from "../src/UnifiedFetch";

test("basic", async () => {
    const uniFetch = new UnifiedFetch();

    const response = await uniFetch.fetch('https://httpbin.org/post', {method: 'POST', body: 'a=1'});
    const json = await response.json();
    console.log(json);
    expect(true).toBeTruthy();
});
