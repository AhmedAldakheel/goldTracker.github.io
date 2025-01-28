async function fetchGoldPrices() {
    try {
        const response = await fetch('https://your-app.onrender.com/get-gold-prices');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const message = document.getElementById('message');
        message.textContent = `Gold Price (1 oz): ${data.gold_oz} BHD, Gold Price (20g): ${data.gold_20g} BHD`;
    } catch (error) {
        console.error('Error fetching gold prices:', error);
        const message = document.getElementById('message');
        message.textContent = 'Failed to load prices.';
    }
}

fetchGoldPrices();
