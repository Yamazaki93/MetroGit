import { Status } from "./status";

export interface Transition {
    id: string;
    name: string;
    to: Status;
    hasScreen: boolean;
    isGlobal: boolean;
    isInitial: boolean;
    isConditional: boolean;
    fields: any;
}
