async function fetchGoldPrices() {
    try {
        const response = await fetch('https://goldtracker-github-io-1.onrender.com/get-gold-prices');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        document.getElementById('goldOz').textContent = data.gold_oz.toFixed(2);
        document.getElementById('gold20g').textContent = data.gold_20g.toFixed(2);

        // إزالة رسالة الخطأ
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = '';
        }
    } catch (error) {
        console.error('Error fetching gold prices:', error);
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = 'Failed to load prices.';
        }
    }
}

// جلب البيانات عند تحميل الصفحة
fetchGoldPrices();

// تحديث البيانات كل 12 ساعة
setInterval(fetchGoldPrices, 43200000);
