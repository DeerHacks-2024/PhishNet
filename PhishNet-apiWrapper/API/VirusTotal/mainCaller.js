import { makeAPICall } from "./subCaller.js";

export class VirusTotal {

    constructor(API_KEY) {

        this.API_KEY = API_KEY;


    }


    async isMalicious(url) {

        let result = await makeAPICall(this.API_KEY, url)
        let positives = result.positives ?? 0;

        if (positives >= 7) {

            return true

        } else {

            return false

        }

    }
}