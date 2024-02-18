import { useState } from 'react';
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
const ScanComponent = () => {
  const [url, setUrl] = useState<string>(''); // Explicitly type url as string
  const [results, setResults] = useState<ScanResults | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [ipQualityScoreRating, setIpQualityScoreRating] = useState<string | null>(null);
  const [error, setError] = useState<string>('');


  const handleScan = async () => {
    const results: ScanResults = {
      matches: []
    };

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
    const exerraMatches = await getExerraResults(url);
    console.log('rating', rating);
    console.log('ipQualityScoreRating', ipQualityScoreRating);
    results.matches.push(gsbMatches);
    results.matches.push(exerraMatches);
    console.log(results.matches);
    setResults(results);
  };

  return (
    <div>
    <input
      type="text"
      placeholder="Enter URL to scan"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
    />
    <button onClick={handleScan}>Scan URL</button>
    {rating && (
      <div className="mt-4">
        <h2 className="text-lg font-semibold">OpenAI URL Rating</h2>
        <p>Rating: {rating}</p>
      </div>
  )}
    {ipQualityScoreRating && (
      <div className="mt-4">
        <h2 className="text-lg font-semibold">IPQualityScore Rating</h2>
        <p>Rating: {ipQualityScoreRating}</p>
      </div>
    )}
    {results ? (
      results.matches && results.matches.length > 0 ? (
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
      ) : (
        <div>
          <h2>No threats detected by Google Safe Browsing.</h2>
        </div>
      )
    ) : null}
  </div>
  );
};

export default ScanComponent;
