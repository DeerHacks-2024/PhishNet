function payload(urlToCheck) {

    const requestData = {
        client: {
            clientId: 'CatPhish',
            clientVersion: '1.0.0',
        },
        threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [
                { url: urlToCheck },
            ],
        },
    };

    return requestData;

}

export async function makeAPICall(apiKey, url) {

    const apiUrl = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + apiKey;

    const requestData = payload(url);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();
        // Handle the API response here
        return data;
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
    }
}