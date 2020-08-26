import {UnifiedFetch} from "../src/node";
import {IsValid, MetaValidator} from "meta-validator";
import express from "express";
import http, {Server as HttpServer} from "http";
import {Body, JsonController, MetaController, Route} from "meta-controller";
import {HttpStatus, HttpMethod} from "http-status-ts";

const unifiedFetch: UnifiedFetch = new UnifiedFetch();

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

    @JsonController("/basic-test")
    class WidgetController {

        @Route(HttpMethod.GET)
        get(): Widget {
            return testWidget;
        }

        @Route(HttpMethod.POST)
        post(@Body() widget: Widget): Widget {
            expect(widget).toBeInstanceOf(Widget);
            expect(widget).toEqual(testWidget);
            return testWidget;
        }

        @Route(HttpMethod.PUT)
        put(): Widget {
            return testWidget;
        }

        @Route(HttpMethod.DELETE)
        delete(): Widget {
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

test("get by option", async () => {
    expect.assertions(3);
    const response = await unifiedFetch.fetch("http://localhost:4500/basic-test", {method: HttpMethod.GET});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("get by method", async () => {
    expect.assertions(3);
    const response = await unifiedFetch.get("http://localhost:4500/basic-test");
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("post by option", async () => {
    expect.assertions(5);
    const response = await unifiedFetch.fetch("http://localhost:4500/basic-test", {
        method: HttpMethod.POST,
        body: JSON.stringify(testWidget),
        headers: {"Content-Type": "application/json"}
    });
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("post by method", async () => {
    expect.assertions(5);
    const response = await unifiedFetch.post("http://localhost:4500/basic-test", {
        body: JSON.stringify(testWidget),
        headers: {"Content-Type": "application/json"}
    });
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("put by option", async () => {
    expect.assertions(3);
    const response = await unifiedFetch.fetch("http://localhost:4500/basic-test", {method: HttpMethod.PUT});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("put by method", async () => {
    expect.assertions(3);
    const response = await unifiedFetch.put("http://localhost:4500/basic-test");
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("delete by option", async () => {
    expect.assertions(3);
    const response = await unifiedFetch.fetch("http://localhost:4500/basic-test", {method: HttpMethod.DELETE});
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});

test("delete by method", async () => {
    expect.assertions(3);
    const response = await unifiedFetch.delete("http://localhost:4500/basic-test");
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
});
