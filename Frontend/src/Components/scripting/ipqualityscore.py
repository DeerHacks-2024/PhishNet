import requests
from urllib.parse import urlparse


def get_domain_from_url(url):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc or parsed_url.path
    domain = domain.split('@')[-1]  
    domain = domain.split(':')[0]  
    domain = domain.rstrip('/')  
    return domain

def check_ipqualityscore(original_url, api_key):
    domain = get_domain_from_url(original_url)
    api_url = f"https://ipqualityscore.com/api/json/url/{api_key}/{domain}"

    try:
        response = requests.get(api_url)
        if response.status_code == 200:
            data = response.json()
            filtered_data = {
                "Unsafe'": data.get('unsafe'),
                "Malware": data.get('malware'),
                "Phishing": data.get('phishing'),
                "Risk Score (From 0 to 100)": data.get('risk_score'),
                "Category": data.get('category'),
                "Domain": data.get('domain'),
                "IP Address": data.get('ip_address'),
                "Suspicious": data.get('suspicious'),
                "Country Code": data.get('country_code'),
                "Final URL": data.get('final_url'),
            }
            return filtered_data
        else:
            return {"Error": f"Received a {response.status_code} status code from the API."}
    except Exception as e:
        return {"Error": f"An exception occurred: {str(e)}."}
