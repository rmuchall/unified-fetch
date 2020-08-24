export interface ResponsePromise extends Promise<Response> {
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json<T>(): Promise<T>;
    text(): Promise<string>;
}
