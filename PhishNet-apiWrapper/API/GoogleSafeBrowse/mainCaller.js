'use strict';

import { makeAPICall } from './subCaller.js';

export class GoogleSafeBrowse {

    constructor(API_KEY) {

        this.API_KEY = API_KEY;

    }

    async isMalicious(url) {
        const lookup = await makeAPICall(this.API_KEY, url);
        return (lookup["matches"] != null)
    }

    async getThreats(url) {
        const lookup = await makeAPICall(this.API_KEY, url);

        let matches = lookup["matches"] ?? []

        let threatsList = [];

        for (let i = 0; i < matches.length; i++) {

            threatsList.push(matches[i]["threatType"]);
        }

        return threatsList;

    }

}