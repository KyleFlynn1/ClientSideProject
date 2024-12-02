const API_URL = 'https://zillow-com4.p.rapidapi.com/properties/search?location=';
const API_KEY = '61d3ea00eemsh04cd69a0ce65e77p1b227cjsnd38242e62bd2';

// Fetch all results for a given houses name
async function fetchHouseInfo(location) {

    try {
        //The encodeURIComponent function in JavaScript is used to encode a string so it can be safely included as part of a URL. 
        const response = await fetch(`${API_URL}${encodeURIComponent(location)}%2C%20TX&priceType=listPrice`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'zillow-com4.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch house data: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Debugging: Check the raw API response

        if (!data.results || data.results.length === 0) {
            throw new Error('No houses found for the given title.');
        }

        displayHouses(data.results);
    } catch (error) {
        const houseInfo = document.getElementById('house-info');
        houseInfo.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Display all houses on the page
function displayHouses(houses) {
    const houseInfo = document.getElementById('house-info');

    houses.forEach(house => {
        const imageUrl = house.hdpUrl.hdpView?.url || 'https://via.placeholder.com/300x450?text=No+Image';

        // Create a container for each house
        const houseContainer = document.createElement('div');
        houseContainer.style.marginBottom = '20px';
        houseContainer.innerHTML = `
            <h2>${house.value.price}</h2>
            <img src="${imageUrl}" alt="${house.value.price}" style="max-width: 100%; height: auto; border-radius: 10px;" />
        `;
        houseInfo.appendChild(houseContainer);
    });
}

// IIFE for initialization and event listener setup
(function () {
    const houseInput = document.getElementById('house-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', () => {
        const houseLocation = houseInput.value.Trim();
        if (!houseLocation) {
            const houseInfo = document.getElementById('house-info');
            houseInfo.innerHTML = `<p>Please enter a location.</p>`;
            return;
        }
        fetchHouseInfo(houseLocation);
    });
})();



