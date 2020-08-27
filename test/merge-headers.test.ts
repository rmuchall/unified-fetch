import {UnifiedFetch} from "../src/node";

test("merge two different sources", () => {
    const sourceA: Record<string, string> = {
        "A-1": "A-1",
        "A-2": "A-2",
        "A-3": "A-3"
    };
    const sourceB: Record<string, string> = {
        "B-1": "B-1",
        "B-2": "B-2",
        "B-3": "B-3"
    };
    const mergedHeaders = UnifiedFetch.mergeHeaders(sourceA, sourceB);
    const mergedObject = {...sourceA, ...sourceB};

    expect(mergedHeaders).toBeInstanceOf(Headers);
    for (const key of Object.keys(mergedObject)) {
        expect(mergedHeaders.get(key)).toBe(mergedObject[key]);
    }
});

test("override duplicate header", () => {
    const sourceA: Record<string, string> = {"My-Header": "One"};
    const sourceB: Record<string, string> = {"My-Header": "Two"};
    const mergedHeaders = UnifiedFetch.mergeHeaders(sourceA, sourceB);
    expect(mergedHeaders).toBeInstanceOf(Headers);
    expect(mergedHeaders.get("My-Header")).toBe("Two");
});

test("undefined source", () => {
    const mergedHeaders = UnifiedFetch.mergeHeaders(undefined, {
        "My-Header": "One"
    });
    expect(mergedHeaders).toBeInstanceOf(Headers);
    expect(mergedHeaders.get("My-Header")).toBe("One");
});
