import {UnifiedFetch} from "../src/node";
import {IsValid, MetaValidator} from "meta-validator";
import express, {Application} from "express";
import http, {Server as HttpServer} from "http";
import {JsonController, MetaController, Route} from "meta-controller";
import {HttpStatus, HttpMethod} from "http-status-ts";


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

let expressApp: Application;
let apiServer: HttpServer;

beforeAll((done) => {
    MetaController.clearMetadata();

    @JsonController("/error")
    class WidgetController {

        @Route(HttpMethod.GET)
        get(): Widget {
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

afterAll(done => {
    apiServer.close(done);
    done();
});

test("bad path", async () => {
    expect.assertions(3);
    const unifiedFetch: UnifiedFetch = new UnifiedFetch();
    const response = await unifiedFetch.get("http://localhost:4500/error/bad-path");
    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result.message).toEqual("Route not found");
});

test("sync beforeRequestHook", () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        beforeRequestHook: (requestInfo, requestInit) => {
            throw new Error("thrown in sync beforeRequestHook");
        }
    });

    void expect(() => {
        return unifiedFetch.get("http://localhost:4500/error");
    }).rejects.toThrow("thrown in sync beforeRequestHook");
});

test("sync afterResponseHook", () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        afterResponseHook: (response, requestInfo, requestInit) => {
            throw new Error("thrown in sync afterResponseHook");
        }
    });

    void expect(() => {
        return unifiedFetch.get("http://localhost:4500/error");
    }).rejects.toThrow("thrown in sync afterResponseHook");
});


test("async beforeRequestHook", () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        beforeRequestHook: (requestInfo, requestInit) => {
            throw new Error("thrown in async beforeRequestHook");
        }
    });

    void expect(() => {
        return unifiedFetch.get("http://localhost:4500/error");
    }).rejects.toThrow("thrown in async beforeRequestHook");
});

test("async afterResponseHook", () => {
    const unifiedFetch: UnifiedFetch = new UnifiedFetch({
        afterResponseHook: (response, requestInfo, requestInit) => {
            throw new Error("thrown in async afterResponseHook");
        }
    });

    void expect(() => {
        return unifiedFetch.get("http://localhost:4500/error");
    }).rejects.toThrow("thrown in async afterResponseHook");
});
