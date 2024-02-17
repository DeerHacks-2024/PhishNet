export async function makeAPICall(apiKey, url) {

    let apiUrl = "https://www.virustotal.com/api/v3/urls";

    const formData = new FormData();
    formData.append('url', url);


    try {

        const response = await fetch(apiUrl,
            {
                method: "POST",
                headers: { 'x-apikey': apiKey },
                body: formData
            })

        const data = await response.json();
        return data;

    } catch (error) {



        console.error('Error:', error);


    }


}