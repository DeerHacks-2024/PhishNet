import { GoogleSafeBrowse } from '../../../PhishNet-apiWrapper/API/GoogleSafeBrowse/mainCaller'
import { ExerraPhish } from '../../../PhishNet-apiWrapper/API/ExerraPhish/mainCaller'

const GSBAPIKey = 'AIzaSyCuXSnFYY-Q8hmphsEno9-tdJch-HtCdc8';
const ExerraPhishAPIKey = '3c5c21936fmshb2504c2f232d978p1cbb6cjsn8aefc5717260';

export async function getGSBResults(url) {
    const GSBAPICaller = new GoogleSafeBrowse(GSBAPIKey);
    const isMalicious = await GSBAPICaller.isMalicious(url);

    if (isMalicious) {
        let start = Date.now();
        const threats = await GSBAPICaller.getThreats(url);
        let timeTaken = Date.now() - start;
  
        let threatType = '';
        for (const threat of threats) {
          threatType += threat + '';
        }
        const match = {
            api: 'Google Safe Browsing',            
            threatType: threatType,
            threat: {
            url: url
            },
            cacheDuration: timeTaken + 'ms'
        }

        return match;
    } else {
        return {
            api: 'Google Safe Browsing',
            threatType: 'None',
            threat: {
                url: url
            },
            cacheDuration: 'n/a'
        }
    }
}

export async function getExerraResults(url) {
    const ExerraPhishAPICaller = new ExerraPhish(ExerraPhishAPIKey);
    let start = Date.now();
    const isMalicious = await ExerraPhishAPICaller.isMalicious(url);
    let timeTaken = Date.now() - start;

    if (isMalicious) {
        const match = {
            api: 'Exerra Phishing',
            threatType: 'Phishing',
            threat: {
              url: url
            },
            cacheDuration: timeTaken + 'ms'
        }
        return match;
    } else {
        return {
            api: 'Exerra Phishing',
            threatType: 'None',
            threat: {
                url: url
            },
            cacheDuration: 'n/a'
        }
    }
}