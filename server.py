import os
import requests
import time
from flask import Flask, jsonify, render_template
from flask_cors import CORS
from bs4 import BeautifulSoup
from datetime import datetime
import pytz  # مكتبة ضبط التوقيت

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# تخزين آخر 20 عملية فقط
profit_archive = []

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

        # أسعار الشراء الثابتة
        buy_price_oz = 1032
        buy_price_20g = 661

        # حساب الربح/الخسارة
        profit_loss_oz = gold_oz - buy_price_oz
        profit_loss_20g = gold_20g - buy_price_20g
        total_profit_loss = profit_loss_oz + profit_loss_20g

        # ضبط التوقيت ليكون بتوقيت البحرين
        bahrain_tz = pytz.timezone("Asia/Bahrain")
        timestamp = datetime.now(bahrain_tz).strftime("%Y-%m-%d %H:%M:%S")

        # حفظ الأرشيف مع التوقيت الجديد
        profit_archive.append({
            "timestamp": timestamp,
            "profit_loss_oz": round(profit_loss_oz, 2),
            "profit_loss_20g": round(profit_loss_20g, 2),
            "total_profit_loss": round(total_profit_loss, 2)
        })

        # الاحتفاظ فقط بآخر 20 عملية
        if len(profit_archive) > 20:
            profit_archive.pop(0)

        return jsonify({
            "gold_oz": gold_oz,
            "gold_20g": gold_20g,
            "profit_archive": profit_archive
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch gold prices", "details": str(e)}), 500

@app.route('/')
def home():
    return render_template('gold_price_tracker.html')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
