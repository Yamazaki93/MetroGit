export class MockElectron {
    private handlers: {
        msg: string
        cb: Function,
    }[];

    constructor() {
        this.handlers = [];
    }

    ipcRenderer = {
        send: (event, handler) => {

        }
    };

    onCD(event: string, handler: Function) {
        this.handlers.push({
            msg: event,
            cb: handler,
        });
    }
    on(event: string, handler: Function) {
        this.handlers.push({
            msg: event,
            cb: handler,
        });
    }
    receiveEvent(event: string, arg: any) {
        this.handlers.forEach(h => {
            if (h.msg === event) {
                h.cb(undefined, arg);
            }
        });
    }
    openUrlExternal(url: string) {
    }

    get available(): boolean {
        return true;
    }
}
