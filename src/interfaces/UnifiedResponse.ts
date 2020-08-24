export interface UnifiedResponse extends Promise<Response> {
    json: <T>() => Promise<T>;
}
