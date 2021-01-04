export interface RequestOptions extends RequestInit {
    json?: Record<string, any>;
    queryStringParams?: Record<string, any>;
}
