declare namespace NodeJS {
    interface Global {
        fetch: any
        // Environment dependent
        navigator: any;
        self: any;
        window: any;
    }
}
