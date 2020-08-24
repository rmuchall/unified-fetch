export function isNode(): boolean {
    return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}

export function isJsDom(): boolean {
    return (typeof window !== "undefined" && window.name === "nodejs")
        || navigator.userAgent.includes("Node.js")
        || navigator.userAgent.includes("jsdom");
}

export function isBrowser(): boolean {
    return !isNode() && typeof window !== "undefined" && typeof window.document !== "undefined";
}

export function isWebWorker(): boolean {
    return typeof self === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
}
