import { GoogleSafeBrowse } from "../../../PhishNet-apiWrapper/API/GoogleSafeBrowse/mainCaller";

console.log('Background script running');
chrome.webNavigation.onBeforeNavigate.addListener(async function(details) {
    const GSBAPIKey = 'AIzaSyCuXSnFYY-Q8hmphsEno9-tdJch-HtCdc8';

    const GSBCaller = new GoogleSafeBrowse(GSBAPIKey);

    const isMalicious = await GSBCaller.isMalicious(details.url);
    if (isMalicious) {
        console.log('This is a malicious website');
        chrome.action.setBadgeBackgroundColor({color: 'red'});
        chrome.action.setBadgeTextColor({color: 'black'});
        chrome.action.setBadgeText({text: 'WARN'});
    } else {
        console.log('This is a safe website');
        chrome.action.setBadgeBackgroundColor({color: 'green'});
        chrome.action.setBadgeTextColor({color: 'white'});
        chrome.action.setBadgeText({text: 'SAFE'});
    }
});
