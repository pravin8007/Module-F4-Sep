document.addEventListener('DOMContentLoaded', function () {
    fetchData();
    const searchInput = document.getElementById('searchInput');
    let debounceTimeout;

    searchInput.addEventListener('input', function(event) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(searchByName, 300); // Debounce time set to 300ms
    });

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            clearTimeout(debounceTimeout);
            searchByName();
        }
    });
});

async function fetchData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderCryptoTable(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderCryptoTable(data) {
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    cryptoTableBody.innerHTML = '';
    data.forEach(crypto => {
        const row = document.createElement('tr');

        const iconCell = document.createElement('td');
        const icon = document.createElement('img');
        icon.src = crypto.image;
        icon.alt = crypto.name;
        iconCell.appendChild(icon);
        row.appendChild(iconCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = crypto.name;
        // nameCell.style.padding = '0';
        row.appendChild(nameCell);

        const symbolCell = document.createElement('td');
        symbolCell.textContent = crypto.symbol.toUpperCase();

        symbolCell.style.padding = '0';
        row.appendChild(symbolCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = '$' + crypto.current_price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        row.appendChild(priceCell);

        const volumeCell = document.createElement('td');
        volumeCell.textContent = '$' + crypto.total_volume.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        row.appendChild(volumeCell);

        const percentageChangeCell = document.createElement('td');
        const percentageChangeValue = parseFloat(crypto.price_change_percentage_24h).toFixed(2);
        const percentageChangeText =  percentageChangeValue + '%';
        percentageChangeCell.textContent = percentageChangeText;
        if (percentageChangeValue >= 0) {
            percentageChangeCell.style.color = 'green';
        } else {
            percentageChangeCell.style.color = 'red';
        }
        row.appendChild(percentageChangeCell);

        const marketCapCell = document.createElement('td');
        marketCapCell.textContent = 'Mkt Cap: $' + crypto.market_cap.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        row.appendChild(marketCapCell);

        cryptoTableBody.appendChild(row);
    });
}

async function searchByName() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const filteredData = data.filter(crypto => {
            const nameMatch = crypto.name.toLowerCase().includes(input);
            const symbolMatch = crypto.symbol.toLowerCase().includes(input);
            return nameMatch || symbolMatch;
        });
        renderCryptoTable(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function sortByMarketCap() {
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    const rows = Array.from(cryptoTableBody.querySelectorAll('tr'));
    rows.sort((row1, row2) => {
        const marketCap1 = parseFloat(row1.children[6].textContent.substring(10).replace(/,/g, ""));
        const marketCap2 = parseFloat(row2.children[6].textContent.substring(10).replace(/,/g, ""));
        return marketCap2 - marketCap1;
    });
    cryptoTableBody.innerHTML = '';
    rows.forEach(row => cryptoTableBody.appendChild(row));
}

function sortByPercentageChange() {
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    const rows = Array.from(cryptoTableBody.querySelectorAll('tr'));
    rows.sort((row1, row2) => {
        const percentageChange1 = parseFloat(row1.children[5].textContent.substring(0, row1.children[5].textContent.indexOf('%')));
        const percentageChange2 = parseFloat(row2.children[5].textContent.substring(0, row2.children[5].textContent.indexOf('%')));
        return percentageChange2 - percentageChange1;
    });
    cryptoTableBody.innerHTML = '';
    rows.forEach(row => cryptoTableBody.appendChild(row));
}