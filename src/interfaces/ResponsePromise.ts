export interface ResponsePromise extends Promise<Response> {
    json: <T>() => Promise<T>;
}
