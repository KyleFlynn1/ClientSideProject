//API Key and API Host for Zillow Rapid API
const apiKey = '61d3ea00eemsh04cd69a0ce65e77p1b227cjsnd38242e62bd2';
const apiHost = 'zillow-com4.p.rapidapi.com';
    
//Search button event listener for when its clicked and read data from selected buttons
document.getElementById('getHouseButton').addEventListener('click', async () => {
    const selectedCities = [];
    const selectedType = [];
    const selectedSortType = [];
    //Button Checkboxes and id to only get relevant information from select checkboxes
    const cityCheckboxes = document.querySelectorAll('#city input[type="checkbox"]');
    const typeCheckboxes = document.querySelectorAll('#type input[type="checkbox"]');
    const sortTypeCheckboxes = document.querySelectorAll('#sortType input[type="checkbox"]');

    //Make sure atleast 1 city is selected
    for (let i = 0; i < cityCheckboxes.length; i++) {
        if (cityCheckboxes[i].checked) {
            selectedCities.push(cityCheckboxes[i].value);
        }
    }

    //Make sure one type of listing is selected 
    for (let i = 0; i < typeCheckboxes.length; i++) {
        if (typeCheckboxes[i].checked) {
            selectedType.push(typeCheckboxes[i].value);
        }
    }

    //Make sure that there is one sort order selected for the listings
    for (let i = 0; i < sortTypeCheckboxes.length; i++) {
        if (sortTypeCheckboxes[i].checked) {
            selectedSortType.push(sortTypeCheckboxes[i].value);
        }
    }
    
    //get the div of house where containers will be stored
    const topDiv = document.getElementById('house');

    //If there isnt a city, listing type or sort type selected give error to the user
    if (selectedCities.length === 0 || selectedType.length === 0 || sortType.length === 0) {
        topDiv.innerHTML = '<p>Please select at least one city and type.</p>';
        return;
    }

    

    
    const houseDiv = document.getElementById('house');
   houseDiv.innerHTML = '<p>Loading house data...</p>';


   //Use the function fetch city to and give the data from checkboxes to fill in the API Url to get the JSON data back
    const filteredResults = [];
    for (let i = 0; i < selectedCities.length; i++) {
        //result is the json data that is returned from the fetch city methos
        const result = await fetchCity(selectedCities[i],selectedType[i], selectedSortType[i]);
        filteredResults.push(result);
    }

    let houseHTMl = '';
    //Access data array that is in json file and contains all the relevant information to render
    const houses = filteredResults[0].data; // Access the array of houses

    //Render all houses in the array out to the div 
    for (let i = 0; i < houses.length; i++) {
        const house = houses[i];
        const imageUrl = house.media.propertyPhotoLinks.highResolutionLink || 'https://via.placeholder.com/300x450?text=No+Image';
        //Use the second endpoint method to get more details on the house previous sale date and price when it was first for sale using the zpid provided from the first Endpoint
        const estimateResult = await fetchHouseEstimate(house.zpid);
        //If the house is for rent render data diffrenlty as information given to the user is different when renting a property
        if (selectedType[0] === "forRent")
        {
            houseHTMl += `
                <div class="container">
                    <p><strong>Status:</strong> ${house.listing?.listingStatus || house.listingStatus || 'Unknown'} </p>
                        <img src="${imageUrl}" alt="${house.price?.value}" style="max-width: 100%; height: auto; border-radius: 10px;" />
                        <p><strong>Address:</strong> ${house.address.streetAddress}</p>
                        <p><strong>ZipCode:</strong> ${house.address.zipcode}</p>
                        <p><strong>Rental Type: </strong> ${house.groupType || "N/A"}</p>
                        <p><strong>Min Price:</strong> $ ${house.minPrice}</p>
                        <p><strong>Max Price:</strong> $${house.maxPrice}</p>
                        <p><strong>First Sale Date:</strong> ${estimateResult.data.priceHistory[0].date}</p>
                        <p><strong>First Sale Price:</strong> $${estimateResult.data.priceHistory[0].price}</p>
                </div>
            `;
        }
        //If the house is for sale or sold listing then render the details based on that
        else{ 
            houseHTMl += `
                <div class="container">
                    <p><strong>Status:</strong> ${house.listing?.listingStatus || house.listingStatus || 'Unknown'} </p>
                        <img src="${imageUrl}" alt="${house.price?.value}" style="max-width: 100%; height: auto; border-radius: 10px;" />
                        <p><strong>Address:</strong> ${house.address.streetAddress}</p>
                        <p><strong>Country:</strong> ${house.country}</p>
                        <p><strong>Price: $</strong> ${house.price?.value || "N/A"}</p>
                        <p><strong>Bedrooms:</strong> ${house.bedrooms}</p>
                        <p><strong>First Sale Date:</strong> ${estimateResult.data.priceHistory[0].date}</p>
                        <p><strong>First Sale Price:</strong> $${estimateResult.data.priceHistory[0].price}</p>
                </div>
            `;
        }
    }
    houseDiv.innerHTML = houseHTMl;
});
    
//First endpoint to get the houses for that city and the sort filters
async function fetchCity(city, type, sortType) {
    const url = `https://zillow-com4.p.rapidapi.com/properties/search?location=${city}&status=${type}&sort=price&sortType=${sortType}&priceType=listPrice&listingType=agent`;
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

    
//Second endpoint to get the house first sell price and data using the ZPID provided from the First Endpoint
async function fetchHouseEstimate(zpid) {
    const url = `https://zillow-com4.p.rapidapi.com/properties/price-tax-history?zpid=${zpid}`;
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
            throw new Error(`Error fetching houses for ${zpid}: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

