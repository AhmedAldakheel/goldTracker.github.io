async function fetchGoldPrices() {
    try {
        // إرسال الطلب إلى API للحصول على أسعار الذهب
        const response = await fetch('https://your-app.onrender.com/get-gold-prices', {
            method: 'GET', // تحديد الطريقة GET
            headers: {
                'Content-Type': 'application/json', // تحديد نوع المحتوى إلى JSON
            },
            mode: 'cors'  // تفعيل CORS للوصول من مصادر مختلفة
        });

        // إذا كان الاستجابة غير صحيحة (أي حالة غير 2xx)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // تحويل الاستجابة إلى JSON
        const data = await response.json();
        console.log('Fetched data:', data);

        // تحديث عناصر HTML بناءً على البيانات المستلمة
        document.getElementById('goldOz').textContent = data.gold_oz.toFixed(2);
        document.getElementById('gold20g').textContent = data.gold_20g.toFixed(2);

        // يمكنك إضافة أي إجراءات أخرى لتحديث الصفحة بناءً على البيانات هنا

    } catch (error) {
        console.error('Error fetching gold prices:', error);

        // عرض رسالة الخطأ في الصفحة
        const messageElement = document.getElementById('profitLoss');
        if (messageElement) {
            messageElement.textContent = 'Failed to load prices.';
        }
    }
}

// استدعاء الدالة لجلب البيانات عند تحميل الصفحة
fetchGoldPrices();
