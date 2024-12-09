const apiKey = '67ebc96918mshf722694c1c0425cp18a43cjsn4654236c4225';
const apiHost = 'zillow-com4.p.rapidapi.com';
    
document.getElementById('getHouseEstimate').addEventListener('click', async () => {
    
});
    
async function fetchEstimate(zpid) {
    const url = `https://zillow-com4.p.rapidapi.com/properties/zestimate-history?zpid=${zpid}`;
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