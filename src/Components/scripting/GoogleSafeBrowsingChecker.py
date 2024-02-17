import requests 
from prettytable import PrettyTable

# Google Save Browsing
def check_with_google_safe_browsing(url, api_key):
    api_url = "https://safebrowsing.googleapis.com/v4/threatMatches:find"
    payload = {
        "client": {
            "clientId": "NoPhish",
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }
    params = {'key': api_key}
    response = requests.post(api_url, params=params, json=payload)
    if response.status_code == 200:
        matches = response.json()
        return matches
    else:
        return None
    
def display_google_safe_browsing_results(url, api_key):
    result = check_with_google_safe_browsing(url, api_key)
    if result and result.get('matches'):
        table = PrettyTable()
        table.field_names = ["Threat Type", "Platform Type", "URL", "Cache Duration"]
        for match in result['matches']:
            table.add_row([match['threatType'], match['platformType'], match['threat']['url'], match['cacheDuration']])
        print(table)
    else:
        print("No threats detected by Google Safe Browsing.")