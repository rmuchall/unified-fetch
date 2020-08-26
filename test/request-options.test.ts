import {UnifiedFetch} from "../src/nodejs";
import {IsValid, MetaValidator} from "meta-validator";
import express from "express";
import http, {Server as HttpServer} from "http";
import {Body, JsonController, MetaController, Route} from "meta-controller";
import {HttpMethod} from "http-status-ts";

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

    @JsonController("/request-options")
    class WidgetController {

        @Route(HttpMethod.POST, "/json")
        postJson(@Body() widget: Widget): Widget {
            expect(widget).toBeInstanceOf(Widget);
            expect(widget).toEqual(testWidget);
            return widget;
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

test("json", async () => {
    expect.assertions(3);
    const result = await unifiedFetch.fetch("http://localhost:4500/request-options/json", {
        method: "POST",
        json: testWidget
    }).json<Widget>();
    expect(result).toEqual(testWidget);
});
