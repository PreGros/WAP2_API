const PORT = 3000;

document.getElementById('fetchData').addEventListener('click', async () => {
    const outputDiv = document.getElementById('output');
    const userName = document.getElementById('userName').value.trim();

    if (!userName) {
        outputDiv.innerHTML = 'Please enter a valid User Name.';
        return;
    }

    outputDiv.innerHTML = 'Loading...';

    let queryUrl = `http://localhost:${PORT}/api/collection/${userName}?display=`;

    let propertiesToAdd = [];

    const selectedOwn = document.querySelector('input[name="own"]:checked').value;
    if (selectedOwn == "show") {
        propertiesToAdd.push("own=1");
    }
    else if (selectedOwn == "hide") {
        propertiesToAdd.push("own=0");
    }

    const selectedPrevowned = document.querySelector('input[name="prevowned"]:checked').value;
    if (selectedPrevowned == "show") {
        propertiesToAdd.push("prevowned=1");
    }
    else if (selectedPrevowned == "hide") {
        propertiesToAdd.push("prevowned=0");
    }

    const forTrade = document.querySelector('input[name="fortrade"]:checked').value;
    if (forTrade == "show") {
        propertiesToAdd.push("fortrade=1");
    }
    else if (forTrade == "hide") {
        propertiesToAdd.push("fortrade=0");
    }

    const want = document.querySelector('input[name="want"]:checked').value;
    if (want == "show") {
        propertiesToAdd.push("want=1");
    }
    else if (want == "hide") {
        propertiesToAdd.push("want=0");
    }

    const wantToPlay = document.querySelector('input[name="wanttoplay"]:checked').value;
    if (wantToPlay == "show") {
        propertiesToAdd.push("wanttoplay=1");
    }
    else if (wantToPlay == "hide") {
        propertiesToAdd.push("wanttoplay=0");
    }

    const wantToBuy = document.querySelector('input[name="wanttobuy"]:checked').value;
    if (wantToBuy == "show") {
        propertiesToAdd.push("wanttobuy=1");
    }
    else if (wantToBuy == "hide") {
        propertiesToAdd.push("wanttobuy=0");
    }

    const wishlist = document.querySelector('input[name="wishlist"]:checked').value;
    if (wishlist == "show") {
        propertiesToAdd.push("wishlist=1");
    }
    else if (wishlist == "hide") {
        propertiesToAdd.push("wishlist=0");
    }

    const preordered = document.querySelector('input[name="preordered"]:checked').value;
    if (preordered == "show") {
        propertiesToAdd.push("preordered=1");
    }
    else if (preordered == "hide") {
        propertiesToAdd.push("preordered=0");
    }

    if (Array.isArray(propertiesToAdd)) {
        queryUrl += propertiesToAdd.pop();
    }

    if (Array.isArray(propertiesToAdd)) {
        propertiesToAdd.forEach(property => {
            queryUrl += "," + propertiesToAdd.pop();
        });
    }

    try {
        const response = await fetch(queryUrl, {
            headers: {
                'x-api-key': 'debug-api-key',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        outputDiv.innerHTML = '';

        if (!data.collectionItems || data.collectionItems.length === 0) {
            outputDiv.innerHTML = 'No collection items found.';
            return;
        }

        data.collectionItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('play-item');

            itemDiv.innerHTML = `
                <h2>${item.name}</h2>
                <p><strong>ID:</strong> ${item.id}</p>
                <p><strong>Year Published:</strong> ${new Date(item.yearPublished).getFullYear()}</p>
                <p><strong>Type:</strong> ${item.type}</p>
                <p><strong>Number of Plays:</strong> ${item.numPlays}</p>
                <p><strong>Last Modified:</strong> ${new Date(item.lastModified).toLocaleDateString()}</p>
                <p><strong>Status Code:</strong> ${item.statusCode}</p>
            `;

            outputDiv.appendChild(itemDiv);
        });
    } catch (error) {
        outputDiv.innerHTML = `Error: ${error.message}`;
    }
});