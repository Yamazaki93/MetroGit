import { EventEmitter } from "../../../../node_modules/@angular/core";

export class MockCredential {
    username = "";
    password = "";
    email = "";
    name = "";
    credentialChange = new EventEmitter<{ username: string, password: string }>();
    constructor(
    ) {
    }

    init() {

    }

    promptUserUpdateCredential() {
    }

    promptUserEnterSSHPassword() {
    }

    notifyCredentialChange() {
    }

    updateCredentials(username, password) {
    }
}
