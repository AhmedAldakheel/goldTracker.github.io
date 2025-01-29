async function fetchGoldPrices() {
    try {
        const response = await fetch('https://goldtracker-github-io-1.onrender.com/get-gold-prices');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        // تحديث أسعار الذهب
        if (!isNaN(data.gold_oz)) {
            document.getElementById('goldOz').textContent = data.gold_oz.toFixed(2);
        } else {
            document.getElementById('goldOz').textContent = 'N/A';
        }

        if (!isNaN(data.gold_20g)) {
            document.getElementById('gold20g').textContent = data.gold_20g.toFixed(2);
        } else {
            document.getElementById('gold20g').textContent = 'N/A';
        }

        // تحديث الأرشيف
        if (data.profit_archive && Array.isArray(data.profit_archive)) {
            updateProfitHistory(data.profit_archive);
        } else {
            console.error('Profit archive is missing or not an array.');
        }

        // إزالة رسالة الخطأ
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = '';
        }
    } catch (error) {
        console.error('Error fetching gold prices:', error);

        // عرض رسالة الخطأ
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = 'Failed to load prices.';
        }
    }
}

function updateProfitHistory(profitHistory) {
    const profitHistoryTable = document.getElementById('profitHistory');
    if (!profitHistoryTable) {
        console.error('Profit history table is missing.');
        return;
    }

    profitHistoryTable.innerHTML = ''; // تفريغ الجدول

    if (profitHistory.length > 0) {
        profitHistory.forEach(record => {
            const row = `<tr>
                <td>${record.timestamp}</td>
                <td class="${record.profit_loss_oz >= 0 ? 'profit' : 'loss'}">${record.profit_loss_oz.toFixed(2)} BHD</td>
                <td class="${record.profit_loss_20g >= 0 ? 'profit' : 'loss'}">${record.profit_loss_20g.toFixed(2)} BHD</td>
                <td class="${record.total_profit_loss >= 0 ? 'profit' : 'loss'}">${record.total_profit_loss.toFixed(2)} BHD</td>
            </tr>`;
            profitHistoryTable.innerHTML += row;
        });
    } else {
        profitHistoryTable.innerHTML = '<tr><td colspan="4">No records yet.</td></tr>';
    }
}

// جلب البيانات عند تحميل الصفحة
fetchGoldPrices();

// تحديث البيانات كل 12 ساعة
setInterval(fetchGoldPrices, 43200000);
