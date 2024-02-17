import { PhishAPI, API_KEYS } from "./API/api.js"
import { makeAPICall as makeAPICallGSB } from "./API/GoogleSafeBrowse/subCaller.js"
import { makeAPICall as makeAPICallVT } from "./API/VirusTotal/subCaller.js";


let url = "emilylovetr.wixsite.com";

let ipscore_api = "USQRjgICwlPAMl3Tmnj5lFS56biNNZ3k"
let api_key_urlscan = "b9e82d19-c7ca-478d-9e98-1bc94f514168"
let api_key_gs = "AIzaSyCuXSnFYY-Q8hmphsEno9-tdJch-HtCdc8"
let api_key_virustotal = "62e9a9c1c44d7c9ec446dc5a3308750480d66b2ed7773287ec524dd740dff76e"
let api_ExerraPhish = "3c5c21936fmshb2504c2f232d978p1cbb6cjsn8aefc5717260"

//----- Testing the main functions (front end will mainly be using these):


let keys = new API_KEYS();
keys.GSB_KEY = api_key_gs;
keys.VT_KEY = api_key_virustotal;
let apiCaller = new PhishAPI(keys);

async function testGSBMalicious() {

    let isMalicious = await apiCaller.GSB.isMalicious(url);
    console.log(isMalicious)

}

async function testGSBThreats() {

    let threatsList = await apiCaller.GSB.getThreats(url);
    console.log(threatsList)


}


async function testVirusTotalMalicious() {

    let isMalicious = await apiCaller.virusTotal.isMalicious(url);
    console.log(isMalicious);

}

//---- Testing raw JSON:

async function testGSBRaw() {

    let res = await makeAPICallGSB(api_key_gs, url);
    console.log(res);
}

async function testVirusTotalRaw() {

    let res = await makeAPICallVT(api_key_virustotal, url);
    console.log(res);

}

testVirusTotalMalicious()