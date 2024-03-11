
from flask import Flask, request, jsonify
import openai
from os import environ

app = Flask(__name__)

openai.api_key = environ.get("OPENAI_API_KEY", "openai_api_key")

@app.route('/')
def home():
    return "Scam Emails Detector Backend Running"

@app.route('/analyze', methods=['POST'])
def analyze_email():
    email_content = request.json.get('emailContent')
    if not email_content:
        return jsonify({"error": "No email content provided"}), 400

    try:
        response = openai.Completion.create(
          engine="text-davinci-003", # or another suitable model
          prompt=f"Detect any phishing tactics in the following email content:\n\n{email_content}",
          temperature=0.5,
          max_tokens=100,
          top_p=1.0,
          frequency_penalty=0.0,
          presence_penalty=0.0
        )

        analysis_results = response.choices[0].text.strip()
        return jsonify({"success": True, "analysisResults": analysis_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
