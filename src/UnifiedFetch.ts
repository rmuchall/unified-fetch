import {InstanceOptions} from "./interfaces/InstanceOptions";
import {isBrowser, isJsDom, isNode, isWebWorker} from "./utilities/detect-environment";

export class UnifiedFetch {
    instanceOptions?: InstanceOptions;

    constructor(instanceOptions?: InstanceOptions) {
        if (instanceOptions) {
            this.instanceOptions = instanceOptions;
        }
    }

    async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
        return fetch(input, init);
    }

    static logEnvironment(): void {
        console.log(`isNode = ${isNode()}`);
        console.log(`isJsDom = ${isJsDom()}`);
        console.log(`isBrowser = ${isBrowser()}`);
        console.log(`isWebWorker = ${isWebWorker()}`);
    }
}
