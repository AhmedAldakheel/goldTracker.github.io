from flask import Flask, jsonify, render_template
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/get-gold-prices', methods=['GET'])
def get_gold_prices():
    try:
        url = "https://bahrain-goldprice.com/"
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        gold_oz = None
        gold_20g = None

        gold_oz_row = soup.find_all("div", class_="divTableRow")
        for row in gold_oz_row:
            cells = row.find_all("div", class_="divTableCell")
            if len(cells) >= 2:
                if "سعر سبيكة الذهب اليوم أونصة" in cells[0].text:
                    gold_oz = float(cells[1].text.strip().replace(",", ""))
                elif "سعر سبيكة الذهب اليوم 20 جرام" in cells[0].text:
                    gold_20g = float(cells[1].text.strip().replace(",", ""))

        if gold_oz is None or gold_20g is None:
            raise ValueError("Failed to extract gold prices.")

        return jsonify({"gold_oz": gold_oz, "gold_20g": gold_20g})
    except Exception as e:
        return jsonify({"error": "Failed to fetch gold prices", "details": str(e)}), 500

@app.route('/')
def home():
    return render_template('gold_price_tracker.html')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
