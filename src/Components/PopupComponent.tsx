import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const PopupComponent = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [openAiRating, setOpenAiRating] = useState('');
  const [ipQualityScoreRating, setIpQualityScoreRating] = useState('');
  const [googleSafeBrowsingResults, setGoogleSafeBrowsingResults] = useState('');
  const [virusTotalUrlId, setVirusTotalUrlId] = useState('');
  const [virusTotalStats, setVirusTotalStats] = useState({
    malicious: 0,
    suspicious: 0,
    harmless: 0,
    undetected: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0]?.url || 'No URL found';
      setCurrentUrl(url);
      if (url !== 'No URL found') {
        handleScan(url);
      }
    });
  }, []);

  const handleScan = async (url:string) => {
    try {
      const openAiResponse = await fetch('http://localhost:5000/rate-url/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!openAiResponse.ok) throw new Error('OpenAI rating API response was not ok');
      const openAiData = await openAiResponse.json();
      setOpenAiRating(openAiData.openai_rating);

      const ipQualityResponse = await fetch(`http://localhost:5000/rate-url/ipqualityscore?url=${encodeURIComponent(url)}`);
      if (!ipQualityResponse.ok) throw new Error('IPQualityScore API response was not ok');
      const ipQualityData = await ipQualityResponse.json();
      setIpQualityScoreRating(ipQualityData["Risk Score (From 0 to 100)"]);

      const googleResponse = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyCuXSnFYY-Q8hmphsEno9-tdJch-HtCdc8`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: "NoPhish", clientVersion: "1.0" },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      });
      if (!googleResponse.ok) throw new Error(`Google Safe Browsing API response was not ok`);
      const googleData = await googleResponse.json();
      setGoogleSafeBrowsingResults(googleData.matches ? 'Threats detected' : 'No threats detected');

      const virusTotalResponse = await fetch('http://localhost:5000/rate-url/virustotal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!virusTotalResponse.ok) throw new Error('VirusTotal analysis API response was not ok');
    const virusTotalData = await virusTotalResponse.json();
    if (virusTotalData.error) {
      throw new Error(virusTotalData.error);
    } else {
      setVirusTotalUrlId(virusTotalData.url_id);
      setVirusTotalStats({
        malicious: virusTotalData.malicious, 
        suspicious: virusTotalData.suspicious, 
        harmless: virusTotalData.harmless, 
        undetected: virusTotalData.undetected, 
      });
    }
  } catch (error) {
    setError(error instanceof Error ? error.message : 'An unknown error occurred');
  }
  };

  return (
    <div>
      <Link to='/scan'>URL CHECK</Link>
      <p>Current URL: {currentUrl}</p>
      <p>OpenAI Rating: {openAiRating}</p>
      <p>IPQualityScore Rating: {ipQualityScoreRating}/100</p>
      <p>Google Safe Browsing Results: {googleSafeBrowsingResults}</p>
      <p>VirusTotal URL ID: {virusTotalUrlId}</p>
      <div>VirusTotal Analysis:
        <p>Malicious: {virusTotalStats.malicious}</p>
        <p>Suspicious: {virusTotalStats.suspicious}</p>
        <p>Harmless: {virusTotalStats.harmless}</p>
        <p>Undetected: {virusTotalStats.undetected}</p>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};
