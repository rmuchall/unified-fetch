import {UnifiedFetch} from "../src/node";
import {IsValid, MetaValidator} from "meta-validator";
import express from "express";
import http, {Server as HttpServer} from "http";
import {HeaderParam, JsonController, MetaController, Route} from "meta-controller";
import {HttpMethod, HttpStatus} from "http-status-ts";

MetaValidator.clearMetadata();

class Widget {
    @IsValid()
    name: string;

    @IsValid()
    model: number;

    @IsValid()
    isBlue: boolean;
}

const testWidget: Widget = Object.assign<Widget, Widget>(new Widget(), {
    name: "Doodad",
    model: 1234,
    isBlue: true
});

let expressApp: any;
let apiServer: HttpServer;

beforeAll((done) => {
    MetaController.clearMetadata();

    @JsonController("/instance-options")
    class WidgetController {

        @Route(HttpMethod.GET, "/prefix-url")
        prefixUrl(): Widget {
            return testWidget;
        }

        @Route(HttpMethod.GET, "/headers")
        headers(@HeaderParam("Test-Header") testHeader: string): string {
            return testHeader;
        }

        @Route(HttpMethod.GET, "/before-request-hook")
        beforeRequestHook(@HeaderParam("Request-Hook-Header") requestHookHeader: string): string {
            return requestHookHeader;
        }

        @Route(HttpMethod.GET, "/after-response-hook")
        afterResponseHook(): Widget {
            return testWidget;
        }

    }

    expressApp = express();
    MetaController.useExpressServer(expressApp, {
        isDebug: true,
        isUseCors: true,
        controllerClassTypes: [
            WidgetController
        ]
    });
    apiServer = http.createServer(expressApp);
    apiServer.listen(4500, done);
});

afterAll((done) => apiServer.close(done));

test("prefixUrl", async () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        prefixUrl: "http://localhost:4500/"
    });

    expect.assertions(3);
    const response = await unifiedFetch.fetch("/instance-options/prefix-url", {method: HttpMethod.GET});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("headers", async () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        headers: {
            "Test-Header": "this-header-was-set-in-options"
        }
    });

    expect.assertions(3);
    const response = await unifiedFetch.fetch("http://localhost:4500/instance-options/headers", {method: HttpMethod.GET});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("text/html; charset=utf-8");
    const result = await response.text();
    expect(result).toEqual("this-header-was-set-in-options");
});

test("sync beforeRequestHook", async () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        beforeRequestHook: (requestInfo, requestInit) => {
            if (requestInit.headers) {
                requestInit.headers = requestInit.headers.constructor === Headers ? requestInit.headers : new Headers(requestInit.headers);
            } else {
                requestInit.headers = new Headers();
            }

            requestInit.headers.set("Request-Hook-Header", "this-header-was-set-in-before-request-hook");
        }
    });

    expect.assertions(3);
    const response = await unifiedFetch.fetch("http://localhost:4500/instance-options/before-request-hook", {method: HttpMethod.GET});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("text/html; charset=utf-8");
    const result = await response.text();
    expect(result).toEqual("this-header-was-set-in-before-request-hook");
});

test("sync afterResponseHook", async () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        afterResponseHook: (response, requestInfo, requestInit) => {
            (response as any).testAfterResponseHook = "this-was-set-in-after-response-hook";
            return response;
        }
    });

    expect.assertions(4);
    const response = await unifiedFetch.fetch("http://localhost:4500/instance-options/after-response-hook", {method: HttpMethod.GET});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    expect((response as any).testAfterResponseHook).toBe("this-was-set-in-after-response-hook");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("async beforeRequestHook", async () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        beforeRequestHook: async (requestInfo, requestInit) => {
            requestInit.headers = UnifiedFetch.mergeHeaders(requestInit.headers, {
                "Request-Hook-Header": "this-header-was-set-in-before-request-hook"
            });

            return Promise.resolve();
        }
    });

    expect.assertions(3);
    const response = await unifiedFetch.fetch("http://localhost:4500/instance-options/before-request-hook", {method: HttpMethod.GET});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("text/html; charset=utf-8");
    const result = await response.text();
    expect(result).toEqual("this-header-was-set-in-before-request-hook");
});

test("async afterResponseHook", async () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        afterResponseHook: async (response, requestInfo, requestInit) => {
            (response as any).testAfterResponseHook = "this-was-set-in-after-response-hook";
            return Promise.resolve(response);
        }
    });

    expect.assertions(4);
    const response = await unifiedFetch.fetch("http://localhost:4500/instance-options/after-response-hook", {method: HttpMethod.GET});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    expect((response as any).testAfterResponseHook).toBe("this-was-set-in-after-response-hook");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});
