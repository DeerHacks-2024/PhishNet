export async function makeAPICall(apiKey, url) {
    const apiUrl = 'https://www.virustotal.com/vtapi/v2/url/report';
    const params = new URLSearchParams({
        apikey: apiKey,
        resource: url,
    });


    try {
        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const result = await response.json();

        if (result.response_code === 1) {

            return result;

        } else {
            return "No results found for the URL.";
        }

    } catch (error) {
        console.error('Error:', error);
        throw error; // You may want to handle the error in a specific way based on your needs.
    }
}
