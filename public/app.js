async function fetchData() {
    try {
        // Display loading image
        document.getElementById('loading').style.display = 'block';

        const response = await fetch('/api/data'); // Update the route based on your server implementation
        const data = await response.json();

        // Access specific properties from the fetched data
        const message = data.localTime.message;
        const expressTime = data.localTime.expressTime;
        const localTime = data.localTime.localTime;

        // Update the DOM with the specific information
        document.getElementById('message').innerHTML = `<p>${message}</p>`;
        document.getElementById('expressTime').innerHTML = `<p>${expressTime}</p>`;
        document.getElementById('localTime').innerHTML = `<p>${localTime}</p>`;
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        // Hide loading image after data is fetched
        document.getElementById('loading').style.display = 'none';
    }
}

fetchData();