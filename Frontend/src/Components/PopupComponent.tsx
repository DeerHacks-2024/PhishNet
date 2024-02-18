import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGSBResults, getExerraResults } from './Getresults';


interface Match {
  api: string;
  threatType: string;
  threat: {
    url: string;
  };
  cacheDuration: string;
}

interface ScanResults {
  matches: Match[];
}

export const PopupComponent = () => {
  const [results, setResults] = useState<ScanResults | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [ipQualityScoreRating, setIpQualityScoreRating] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0]?.url || 'No URL found';
      if (url !== 'No URL found') {
        handleScan(url);
      }
    });
  }, []);

  const handleScan = async (url: string) => {
    const results: ScanResults = {
      matches: []
    };
    
    try {
      console.error('currentUrl:', url);
      const openAIRatingResponse = await fetch('http://localhost:5000/rate-url/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!openAIRatingResponse.ok) {
        const errorBody = await openAIRatingResponse.json();
        console.error('OpenAI rating API error:', errorBody);
        throw new Error(`OpenAI rating API response was not ok: ${errorBody.message}`);
      }

      const openAIRatingData = await openAIRatingResponse.json();
      setRating(openAIRatingData.openai_rating);

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

    const gsbMatches = await getGSBResults(url);
    const exerraMatches = await getExerraResults(url, false);

    results.matches.push(gsbMatches);
    results.matches.push(exerraMatches);

    setResults(results);
  };

  return (
    <div>
      <Link to='/scan'>URL CHECK</Link>
      {rating && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">OpenAI URL Rating</h2>
          <p>Rating: {rating}</p>
        </div>
      )}
      {ipQualityScoreRating !== null && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">IPQualityScore Rating</h2>
          <p>Rating: {ipQualityScoreRating}</p>
        </div>
      )}
      {results && results.matches.length > 0 && (
        results.matches.map((match, index) => (
          <div key={index}>
            <h2>{match.api} results</h2>
            {match.threatType === 'None' ? (
              <h3>No threats detected by {match.api}.</h3>
            ) : (
              <table className="prettyTable">
                <tbody>
                  <tr>
                    <th>Threat Type</th>
                    <td>{match.threatType}</td>
                  </tr>
                  <tr>
                    <th>URL</th>
                    <td>{match.threat.url}</td>
                  </tr>
                  <tr>
                    <th>Cache Duration</th>
                    <td>{match.cacheDuration}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PopupComponent;
