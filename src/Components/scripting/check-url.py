import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from ipqualityscore import check_ipqualityscore
from virustotal import virus_total_urlanalysis
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

client = OpenAI(api_key="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")

@app.route('/rate-url/openai', methods=['POST'])
def rate_url_openai():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # OpenAI rating
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful phishing page detection assistant."},
                {"role": "user", "content": f"Rate this link based on its appearance and known safety: {url}"}
            ]
        )
        rating = completion.choices[0].message.content.strip()
        return jsonify({"openai_rating": rating})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rate-url/ipqualityscore', methods=['GET'])
def rate_url_ipqualityscore():
    url = request.args.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        api_key = "USQRjgICwlPAMl3Tmnj5lFS56biNNZ3k"
        result = check_ipqualityscore(url, api_key)  
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rate-url/virustotal', methods=['POST'])
def rate_url_virustotal():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        api_key = "62e9a9c1c44d7c9ec446dc5a3308750480d66b2ed7773287ec524dd740dff76e"
        analysis_results = virus_total_urlanalysis(url, api_key)
        logging.debug(f"VirusTotal Stats: {analysis_results}")
        if "Error" not in analysis_results:
            return jsonify(analysis_results)
        else:
            return jsonify({"error": analysis_results["Error"]}), 500
    except Exception as e:
        logging.exception("Failed to process VirusTotal analysis.")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
