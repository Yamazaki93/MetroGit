export class MockElectron {
    private handlers: {
        msg: string
        cb: Function,
    }[];
    private messageSent: string[] = [];

    constructor() {
        this.handlers = [];
    }

    ipcRenderer = {
        send: (event, handler) => {
            this.messageSent.push(event);
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
    messageWasSent(event: string) {
        return this.messageSent.indexOf(event) !== -1;
    }
    openUrlExternal(url: string) {
    }

    get available(): boolean {
        return true;
    }
}
