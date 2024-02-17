import { useState } from 'react';

interface Match {
  threatType: string;
  platformType: string;
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

  const handleScan = async () => {
    const API_URL = 'http://localhost:5000/check-url';
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ScanResults = await response.json(); // Type the response data as ScanResults
      setResults(data);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
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
      {results && results.matches.length > 0 && (
        <div>
          <h2>Scan Results</h2>

          <h3>Google Safe Browsing:</h3>
          {results.matches.map((match, index) => (
            <table className="prettyTable" key={index}>
              <tbody>
                <tr>
                  <th>Threat Type</th>
                  <td>{match.threatType}</td>
                </tr>
                <tr>
                  <th>Platform Type</th>
                  <td>{match.platformType}</td>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ScanComponent;
