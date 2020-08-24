export function getGlobal(): Record<string, any> {
    // Web Worker
    if (typeof self !== "undefined") {
        return self;
    }

    // Browser
    if (typeof window !== "undefined") {
        return window;
    }

    // NodeJs
    if (typeof global !== "undefined") {
        return global;
    }

    throw new Error("Unable to locate global object");
}
