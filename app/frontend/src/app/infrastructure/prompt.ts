import { EventEmitter } from "@angular/core";

export interface Prompt {
    toClose: EventEmitter<{}>;
}
