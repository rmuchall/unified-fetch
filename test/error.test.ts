import {UnifiedFetch} from "../src/node";
import {IsValid, MetaValidator} from "meta-validator";
import express from "express";
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

let expressApp: any;
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

afterAll((done) => apiServer.close(done));

test("bad path", async () => {
    // expect.assertions(3);
    const unifiedFetch: UnifiedFetch = new UnifiedFetch();
    const response = await unifiedFetch.get("http://localhost:4500/error/bad-path");
    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    /*
    // TODO: Re-enable after json 404 handler added to meta-controller
    expect(response.headers.get("content-type")).toEqual("application/json; charset=utf-8");
    const result = await response.json();
    expect(result).toEqual(testWidget);
    */
});
