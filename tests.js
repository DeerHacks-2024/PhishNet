import { PhishAPI, API_KEYS } from "./API/api.js"
import { makeAPICall } from "./API/GoogleSafeBrowse/subCaller.js"


let url = "emilylovetr.wixsite.com";

const API_KEY = "AIzaSyCuXSnFYY-Q8hmphsEno9-tdJch-HtCdc8";


async function testGSBMalicious() {

    let keys = new API_KEYS();
    keys.GSB_KEY = API_KEY;

    let apiCaller = new PhishAPI(keys);


    let isMalicious = await apiCaller.GSB.isMalicious(url);
    console.log(isMalicious)


}

async function testGSBThreats(){

    let keys = new API_KEYS();
    keys.GSB_KEY = API_KEY;

    let apiCaller = new PhishAPI(keys);
    let threatsList = await apiCaller.GSB.getThreats(url);
    console.log(threatsList)


}


async function testGSBRaw() {

    let res = await makeAPICall(API_KEY, url);
    console.log(res);
}


testGSBRaw()
testGSBMalicious()
testGSBThreats()