import { useState } from 'react';
import { Link } from 'react-router-dom';

interface GoogleSafeBrowsingMatch {
  threatType: string;
  platformType: string;
  threat: {
    url: string;
  };
  cacheDuration: string;
}

const ScanComponent = () => {
    const [url, setUrl] = useState<string>('');
    const [rating, setRating] = useState<string | null>(null);
    const [safeBrowsingResults, setSafeBrowsingResults] = useState<GoogleSafeBrowsingMatch[] | string | null>(null);
    const [ipQualityScoreRating, setIpQualityScoreRating] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    const handleScan = async () => {
        try {
          const openAIRatingResponse = await fetch('http://localhost:5000/rate-url/openai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          });
          if (!openAIRatingResponse.ok) {
            throw new Error('OpenAI rating API response was not ok');
          }
          const openAIRatingData = await openAIRatingResponse.json();
          setRating(openAIRatingData.openai_rating);
      
          await checkWithGoogleSafeBrowsing(url);
      
          const encodedURL = encodeURIComponent(url);
          const ipQualityScoreResponse = await fetch(`http://localhost:5000/rate-url/ipqualityscore?url=${encodedURL}`);
          if (!ipQualityScoreResponse.ok) {
            throw new Error('IPQualityScore API response was not ok');
          }
          const ipQualityScoreData = await ipQualityScoreResponse.json();
          setIpQualityScoreRating(ipQualityScoreData["Risk Score (From 0 to 100)"]);
        } catch (error) {
          console.error('There was a problem with your fetch operation:', error);
        }
      };      
      


  const checkWithGoogleSafeBrowsing = async (url:string) => {
    const apiKey = "AIzaSyCuXSnFYY-Q8hmphsEno9-tdJch-HtCdc8"; 
    const apiURL = "https://safebrowsing.googleapis.com/v4/threatMatches:find";
    const payload = {
      client: {
        clientId: "NoPhish",
        clientVersion: "1.0",
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    };

    try {
      const response = await fetch(`${apiURL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Google Safe Browsing API response was not ok');
      }

      const data = await response.json();
      setSafeBrowsingResults(data.matches ? data.matches : 'No threats detected.');
    } catch (error) {
      console.error('There was a problem with the Google Safe Browsing API operation:', error);
      setError('Failed to fetch data from Google Safe Browsing API');
    }
  };

  return (
    <div className="p-4">
        <Link to="/autoscan">Auto Scan Current Page</Link>
  <input
    className="border-2 border-gray-200 p-2 rounded-lg mb-4"
    type="text"
    placeholder="Enter URL to scan"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
  />
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleScan}>Scan URL</button>
  {rating && (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">OpenAI URL Rating</h2>
      <p>Rating: {rating} (1-10 | Less Suspicious to Probably Malicious)</p>
    </div>
  )}
  {ipQualityScoreRating && (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">IPQualityScore Rating</h2>
      <p>Rating: {ipQualityScoreRating}</p>
    </div>
  )}
  {safeBrowsingResults && (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Google Safe Browsing Results</h2>
      {typeof safeBrowsingResults === 'string' ? (
        <p>{safeBrowsingResults}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full mt-2">
            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Threat Type</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Platform Type</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">URL</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Cache Duration</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {safeBrowsingResults.map((match, index) => (
                <tr key={index}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{match.threatType}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{match.platformType}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left text-blue-500 underline">
                      <a href={match.threat.url} target="_blank" rel="noopener noreferrer">{match.threat.url}</a>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{match.cacheDuration}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )}
  {error && <p className="text-red-500">{error}</p>}
</div>

  );
};

export default ScanComponent;
