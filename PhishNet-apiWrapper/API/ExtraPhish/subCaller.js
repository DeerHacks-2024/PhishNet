export async function makeAPICall(apiKey, url) {

    const apiUrl = 'https://exerra-phishing-check.p.rapidapi.com/?url=https%3A%2F%2F' + url;

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'exerra-phishing-check.p.rapidapi.com'
        }
    });

    const data = await response.json();
    // Handle the API response here
    return data;
}