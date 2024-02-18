import requests
import logging

"""
ONLY ACCEPTS HTTP://
"""
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
def format_url_for_virustotal(url):
    if url.startswith('https://'):
        url = 'http://' + url[len('https://'):]
    elif not url.startswith('http://'):
        url = 'http://' + url
    return url

def virus_total_urlanalysis(original_url, api_key):
    url = format_url_for_virustotal(original_url)  
    headers = {
        'x-apikey': api_key
    }
    response = requests.post('https://www.virustotal.com/api/v3/urls', headers=headers, data={'url': url})
    if response.status_code == 200:
        result = response.json()
        url_id = result['data']['id']
        return url_id
    else:
        print(f"Error submitting URL for analysis: {response.status_code}")
        return None

def get_analysis_report(url_id, api_key):
    headers = {
        'x-apikey': api_key
    }
    response = requests.get(f'https://www.virustotal.com/api/v3/analyses/{url_id}', headers=headers)
    if response.status_code == 200:
        result = response.json()
        return result
    else:
        return f"Error: Code Response: {response.status_code}"

def virus_total_analysis(url, api_key):
    url_id = virus_total_urlanalysis(url, api_key)
    if url_id:
        report = get_analysis_report(url_id, api_key)
        if 'data' in report:
            stats = report['data']['attributes']['stats']
            malicious = stats['malicious']
            suspicious = stats['suspicious']
            harmless = stats['harmless']
            undetected = stats['undetected']
            total_scans = malicious + suspicious + harmless + undetected

            logging.debug(f"VirusTotal Stats: Malicious={malicious}, Suspicious={suspicious}, Harmless={harmless}, Undetected={undetected}, Total Scans={total_scans}")

            return {
                "Malicious": malicious,
                "Suspicious": suspicious,
                "Harmless": harmless,
                "Undetected": undetected,
                "Total Scans": total_scans
            }
        else:
            logging.error("Analysis result unavailable.")
            return {"Error": "Analysis result unavailable."}
    else:
        logging.error("Failed to get URL ID for analysis.")
        return {"Error": "Failed to get URL ID for analysis."}