import {UnifiedFetch} from "../src/node";
import {IsValid, MetaValidator} from "meta-validator";
import express from "express";
import http, {Server as HttpServer} from "http";
import {JsonController, MetaController, Route} from "meta-controller";
import {HttpMethod} from "http-status-ts";
import {TextDecoder} from "util";

const unifiedFetch: UnifiedFetch = new UnifiedFetch({
    afterResponseHook: (response, request, options) => {
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return Promise.resolve(response);
    }
});

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

    @JsonController("/extension-methods")
    class WidgetController {

        @Route(HttpMethod.GET, "/json")
        getJson(): Widget {
            return testWidget;
        }

        @Route(HttpMethod.GET, "/buffer")
        getBuffer(): Buffer {
            return Buffer.from(JSON.stringify(testWidget), "ascii");
        }

        /*
        // Not implemented in node-fetch
        // https://github.com/node-fetch/node-fetch/tree/3.x#interface-body
        @Route(HttpMethod.GET, "/form-data")
        getFormData(): FormData {
            const formData = new FormData();
            formData.append("widget-name", testWidget.name);
            return formData;
        }
        */

        @Route(HttpMethod.GET, "/text")
        getText(): string {
            return "Hello world!";
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

test("arrayBuffer()", async () => {
    expect.assertions(1);
    const result = await unifiedFetch.fetch("http://localhost:4500/extension-methods/buffer",
        {method: HttpMethod.GET}).arrayBuffer();
    const decoder = new TextDecoder();
    expect(JSON.parse(decoder.decode(result))).toEqual(testWidget);
});

test("blob()", async () => {
    expect.assertions(1);
    const result = await unifiedFetch.fetch("http://localhost:4500/extension-methods/buffer",
        {method: HttpMethod.GET}).blob();
    const decoder = new TextDecoder();
    expect(JSON.parse(decoder.decode(await result.arrayBuffer()))).toEqual(testWidget);
});

/*
// Not implemented in node-fetch
// https://github.com/node-fetch/node-fetch/tree/3.x#interface-body
test("formData()", async () => {
    expect.assertions(1);
    const result = await unifiedFetch.fetch("http://localhost:4500/extension-methods/form-data",
        {method: HttpMethod.GET}).formData();
    expect(result.get("widget-name")).toEqual("Doodad");
});
*/

test("json()", async () => {
    expect.assertions(1);
    const result = await unifiedFetch.fetch("http://localhost:4500/extension-methods/json",
        {method: HttpMethod.GET}).json<Widget>();
    expect(result).toEqual(testWidget);
});

test("text()", async () => {
    expect.assertions(1);
    const result = await unifiedFetch.fetch("http://localhost:4500/extension-methods/text",
        {method: HttpMethod.GET}).text();
    expect(result).toEqual("Hello world!");
});
