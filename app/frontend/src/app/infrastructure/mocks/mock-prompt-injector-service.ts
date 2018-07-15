import { Output, EventEmitter, Type } from "../../../../node_modules/@angular/core";
import { Prompt } from "../prompt";

export class MockPromptInjector {

    @Output() componentChange = new EventEmitter<Prompt>();
    constructor(
    ) { }

    init() {
    }

    injectComponent<T extends Prompt>(component: Type<T>): T {
        return undefined;
    }
}
