from flask import Flask, request, jsonify
from flask_cors import CORS
import os
# from dotenv import load_dotenv
from GoogleSafeBrowsingChecker import check_with_google_safe_browsing

# load_dotenv()  

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes and origins

@app.route('/check-url', methods=['POST'])
def check_url():
    data = request.json
    url = data['url']
    api_key = "AIzaSyCuXSnFYY-Q8hmphsEno9-tdJch-HtCdc8"
    result = check_with_google_safe_browsing(url, api_key)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
