async function fetchGoldPrices() {
    try {
        const response = await fetch('https://goldtracker-github-io-1.onrender.com/get-gold-prices', { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // تحديث بيانات الأسعار في الصفحة
        const goldOzElement = document.getElementById('goldOz');
        const gold20gElement = document.getElementById('gold20g');
        const messageElement = document.getElementById('message');

        if (goldOzElement && gold20gElement) {
            goldOzElement.textContent = data.gold_oz.toFixed(2);
            gold20gElement.textContent = data.gold_20g.toFixed(2);
        }

        // تحديث الأرشيف إذا كان متاحًا
        if (data.profit_archive) {
            updateProfitHistory(data.profit_archive);
        }

        if (messageElement) {
            messageElement.textContent = ''; // إزالة رسالة الفشل عند النجاح
        }
    } catch (error) {
        console.error('Error fetching gold prices:', error);

        // تحديث الرسائل عند الفشل
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = 'Failed to load prices.';
        }
    }
}

// تحديث جدول الأرشيف
function updateProfitHistory(profitHistory) {
    const profitHistoryTable = document.getElementById('profitHistory');
    if (!profitHistoryTable) {
        console.error('Profit history table is missing.');
        return;
    }

    profitHistoryTable.innerHTML = ''; // تفريغ الجدول قبل التحديث

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

// تحديث البيانات كل 12 ساعة (43200000 ميلي ثانية)
setInterval(fetchGoldPrices, 43200000);
