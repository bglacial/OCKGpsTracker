import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
    public currentSessionId = null;

    constructor() {
    }

    setMyGlobalVar(value) {
        this.currentSessionId = value;
    }

    getMyGlobalVar() {
        return this.currentSessionId;
    }

}