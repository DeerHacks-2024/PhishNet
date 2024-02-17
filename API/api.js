import {GoogleSafeBrowse} from "./GoogleSafeBrowse/mainCaller.js";

export class API_KEYS {

    constructor() {


        this.GSB_KEY = "";


    }

}




export class PhishAPI {

    constructor(API_KEYS = new API_KEYS()) {

        this.API_KEYS = API_KEYS;
        this.GSB = new GoogleSafeBrowse(this.API_KEYS.GSB_KEY);

    }

    setGSBKey(key) {

        this.API_KEYS.GSB_KEY = key;
        this.GSB.API_KEY = key;


    }


}