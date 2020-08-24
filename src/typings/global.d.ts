declare global {
    const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    // Environment dependent
    const navigator: any;
    const self: any;
    const window: any;
}
