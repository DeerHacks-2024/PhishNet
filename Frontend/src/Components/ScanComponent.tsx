import { useState } from 'react';
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

const ScanComponent = () => {
  const [url, setUrl] = useState<string>('');
  const [results, setResults] = useState<ScanResults | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [ipQualityScoreRating, setIpQualityScoreRating] = useState<string | null>(null);

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
    const exerraMatches = await getExerraResults(url, true);

    results.matches.push(gsbMatches);
    results.matches.push(exerraMatches);

    setResults(results);
  };

  return (
    <div>
      <Link to="/autoscan" className='start-scanning-link scanerok'>Auto Scan Current Page</Link>
      <input
      className='inptok'
        type="text"
        placeholder="Enter URL to scan"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className='scanurlbtn' onClick={handleScan}>Scan URL</button>
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

export default ScanComponent;
