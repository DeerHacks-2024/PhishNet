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

  const handleScan = async () => {
    const results: ScanResults = {
      matches: []
    };

    const gsbMatches = await getGSBResults(url);
    const exerraMatches = await getExerraResults(url);

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
