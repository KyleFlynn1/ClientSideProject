const apiKey = '67ebc96918mshf722694c1c0425cp18a43cjsn4654236c4225';
const apiHost = 'zillow-com4.p.rapidapi.com';
    
document.getElementById('getHouseButton').addEventListener('click', async () => {
    const selectedCities = [];
    const selectedType = [];
    const cityCheckboxes = document.querySelectorAll('#city input[type="checkbox"]');
    const typeCheckboxes = document.querySelectorAll('#type input[type="checkbox"]');
    for (let i = 0; i < cityCheckboxes.length; i++) {
        if (cityCheckboxes[i].checked) {
            selectedCities.push(cityCheckboxes[i].value);
        }
    }

    
    for (let i = 0; i < typeCheckboxes.length; i++) {
        if (typeCheckboxes[i].checked) {
            selectedType.push(typeCheckboxes[i].value);
        }
    }
    
    const topDiv = document.getElementById('house');
    if (selectedCities.length === 0 || selectedType.length === 0) {
        topDiv.innerHTML = '<p>Please select at least one city and type.</p>';
        return;
    }

    
    const houseDiv = document.getElementById('house');
   houseDiv.innerHTML = '<p>Loading house data...</p>';

    const filteredResults = [];
    for (let i = 0; i < selectedCities.length; i++) {
        const result = await fetchCity(selectedCities[i],selectedType[i]);
        filteredResults.push(result);
    }

    let weatherHTML = '';
    const houses = filteredResults[0].data; // Access the array of houses

    for (let i = 0; i < houses.length; i++) {
        const house = houses[i];
        const imageUrl = house.media.propertyPhotoLinks.highResolutionLink || 'https://via.placeholder.com/300x450?text=No+Image';
        if (selectedType[0] === "forRent")
        {
            weatherHTML += `
                <div class="container">
                    <p><strong>Status:</strong> ${house.listing?.listingStatus || house.listingStatus || 'Unknown'} </p>
                        <img src="${imageUrl}" alt="${house.price?.value}" style="max-width: 100%; height: auto; border-radius: 10px;" />
                        <p><strong>Address:</strong> ${house.address.streetAddress}</p>
                        <p><strong>ZipCode:</strong> ${house.address.zipcode}</p>
                        <p><strong>Rental Type: </strong> ${house.groupType || "N/A"}</p>
                        <p><strong>Min Price:</strong> $ ${house.minPrice}</p>
                        <p><strong>Max Price:</strong> $${house.maxPrice}</p>
                </div>
            `;
        }
        else{ 
            weatherHTML += `
                <div class="container">
                    <p><strong>Status:</strong> ${house.listing?.listingStatus || house.listingStatus || 'Unknown'} </p>
                        <img src="${imageUrl}" alt="${house.price?.value}" style="max-width: 100%; height: auto; border-radius: 10px;" />
                        <p><strong>Address:</strong> ${house.address.streetAddress}</p>
                        <p><strong>Country:</strong> ${house.country}</p>
                        <p><strong>Price: $</strong> ${house.price?.value || "N/A"}</p>
                        <p><strong>Bedrooms:</strong> ${house.bedrooms}</p>
                        <p><strong>Bathrooms:</strong> ${house.bathrooms}</p>
                </div>
            `;
        }
    }
    houseDiv.innerHTML = weatherHTML;
});
    
async function fetchCity(city, type) {
    const url = `https://zillow-com4.p.rapidapi.com/properties/search?location=${city}&status=${type}&sort=relevance&priceType=listPrice&listingType=agent`;
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
            throw new Error(`Error fetching houses for ${city}: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}