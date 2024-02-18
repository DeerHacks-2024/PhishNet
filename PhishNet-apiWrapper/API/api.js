import { GoogleSafeBrowse } from "./GoogleSafeBrowse/mainCaller.js";
import { VirusTotal } from "./VirusTotal/mainCaller.js";
import { ExerraPhish } from "./ExtraPhish/mainCaller.js";

export class API_KEYS {

    constructor() {


        this.GSB_KEY = "";
        this.VT_KEY = "";
        this.EP_KEY = "";


    }

}




export class PhishAPI {

    constructor(API_KEYS = new API_KEYS()) {

        this.API_KEYS = API_KEYS;
        this.GSB = new GoogleSafeBrowse(this.API_KEYS.GSB_KEY);
        this.virusTotal = new VirusTotal(this.API_KEYS.VT_KEY);
        this.extraPhish = new ExerraPhish(this.API_KEYS.EP_KEY);

    }

    setGSBKey(key) {

        this.API_KEYS.GSB_KEY = key;
        this.GSB.API_KEY = key;


    }

    setVTKey(key) {

        this.API_KEYS.VT_KEY = key;
        this.virusTotal.API_KEY = key;

    }

    setEPKey(key) {

        this.EP_KEY = key;
        this.extraPhish.API_KEY = key;


    }


}