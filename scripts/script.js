const apiKey = 'dfd9e4c192msh4f1ce955d2673a0p121bf3jsnca194db37f90';
const apiHost = 'zillow-com4.p.rapidapi.com';
    
document.getElementById('getHouseButton').addEventListener('click', async () => {
    const selectedCities = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedCities.push(checkboxes[i].value);
        }
    }
    
        
    if (selectedCities.length === 0) {
        alert('Please select at least one city.');
        return;
    }

    
    const houseDiv = document.getElementById('house');
   houseDiv.innerHTML = '<p>Loading house data...</p>';

    const filteredResults = [];
    const filteredData = [];
    for (let i = 0; i < selectedCities.length; i++) {
        const result = await fetchCity(selectedCities[i]);
        console.log(`Humidity for ${result?.name}: ${result?.main?.humidity}`); // Debugging line        
        filteredResults.push(result);
    }

    if (filteredResults.length === 0) {
       houseDiv.innerHTML = `<p>No cities meet the minimum price requirement of ${minPrice}%.</p>`;
        return;
    }
    
    let weatherHTML = '';
    const houses = filteredResults[0].data; // Access the array of houses

    for (let i = 0; i < houses.length; i++) {
        const house = houses[i];
        weatherHTML += `
            <div class="container">
                <p><strong>City:</strong> ${house.address.streetAddress}</p>
                <p><strong>Country:</strong> ${house.country}</p>
                <p><strong>Price: $</strong> ${house.price?.value || "N/A"}</p>
                <p><strong>Bedrooms:</strong> ${house.bedrooms}</p>
                <p><strong>Bathrooms:</strong> ${house.bathrooms}</p>
            </div>
        `;
    }
    houseDiv.innerHTML = weatherHTML;
});
    
async function fetchCity(city) {
    const url = `https://zillow-com4.p.rapidapi.com/properties/search?location=${city}&listingType=agent`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    };
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error fetching weather for ${city}: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}