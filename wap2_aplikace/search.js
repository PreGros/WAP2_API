document.getElementById('fetchData').addEventListener('click', async () => {
    const outputDiv = document.getElementById('output');
    const publishersDiv = document.getElementById('publishers');
    const searchQuery = document.getElementById('searchQuery').value.trim().replace(/ /g, '+');
    const exactSwitch = document.getElementById('exactSwitch').checked ? 1 : 0;
    const fromYear = document.getElementById('fromYear').value.trim() || '1900';
    const toYear = document.getElementById('toYear').value.trim() || '2025';
    outputDiv.innerHTML = 'Loading...';
    publishersDiv.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:3000/api/search?query=${searchQuery}&exact=${exactSwitch}&fromdate=${fromYear}-01-01&todate=${toYear}-01-01`, {
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

        if (data.length === 0) {
            outputDiv.innerHTML = 'No results found.';
            return;
        }

        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('game-item');
        
            itemDiv.innerHTML = `
                <h2>${item.name}</h2>
                <p><strong>ID:</strong> ${item.id}</p>
                <p><strong>Year Published:</strong> ${new Date(item.yearPublished).getFullYear()}</p>
                <p><strong>Type:</strong> ${item.type}</p>
            `;
        
            if (item.type === "boardgame") {
                const publishersButton = document.createElement('button');
                publishersButton.classList.add('show-publishers');
                publishersButton.setAttribute('data-id', item.id);
                publishersButton.textContent = 'Show Publishers';
                itemDiv.appendChild(publishersButton);
        
                const marketplaceButton = document.createElement('button');
                marketplaceButton.classList.add('show-marketplace');
                marketplaceButton.setAttribute('data-id', item.id);
                marketplaceButton.textContent = 'Show Marketplace';
                itemDiv.appendChild(marketplaceButton);
        
                marketplaceButton.addEventListener('click', async (event) => {
                    const gameId = event.target.getAttribute('data-id');
                    const fromDate = document.getElementById('fromDate').value.trim() || '1900-01-01';
                    const toDate = document.getElementById('toDate').value.trim() || '2025-12-31';
                    const sortOrder = document.getElementById('sortOrder').value;
                    const currency = document.getElementById('currency').value;
                    publishersDiv.innerHTML = 'Loading marketplace items...';
                
                    try {
                        let query = `http://localhost:3000/api/boardgames/${gameId}/marketplace?fromdate=${fromDate}&todate=${toDate}`;
                        if (sortOrder !== "none") {
                            query += `&sort=${sortOrder}`;
                        }

                        if (currency !== "") {
                            query += `&currency=${currency}`;   
                        }

                        const marketplaceResponse = await fetch(query, {
                            headers: {
                                'x-api-key': 'debug-api-key',
                                'Accept': 'application/json'
                            }
                        });
                
                        if (!marketplaceResponse.ok) {
                            publishersDiv.innerHTML = 'Type is wrong, its not a boardgame. Its some additional content.';
                            return;
                        }
                
                        const marketplaceData = await marketplaceResponse.json();
                        console.log(marketplaceData); // Log the response to debug
                
                        if (!marketplaceData.marketListings || !Array.isArray(marketplaceData.marketListings) || marketplaceData.marketListings.length === 0) {
                            publishersDiv.innerHTML = 'No marketplace items found for this boardgame.';
                            return;
                        }
                
                        publishersDiv.innerHTML = `<h2>Marketplace Items (${marketplaceData.listingsCount})</h2>`;
                
                        marketplaceData.marketListings.forEach(item => {
                            const itemDiv = document.createElement('div');
                            itemDiv.classList.add('marketplace-item');
                            itemDiv.innerHTML = `
                                <p><strong>List Date:</strong> ${new Date(item.listDate).toLocaleDateString()}</p>
                                <p><strong>Price:</strong> ${item.price} ${item.currency}</p>
                                <p><strong>Condition:</strong> ${item.condition}</p>
                                <p><strong>Notes:</strong> ${item.notes}</p>
                                <a href="${item.link}" target="_blank">View Listing</a>
                            `;
                            publishersDiv.appendChild(itemDiv);
                        });
                    } catch (error) {
                        publishersDiv.innerHTML = `Error: ${error.message}`;
                    }
                });                
            }
        
            outputDiv.appendChild(itemDiv);
        });

        document.querySelectorAll('.show-publishers').forEach(button => {
            button.addEventListener('click', async (event) => {
                const gameId = event.target.getAttribute('data-id');
                publishersDiv.innerHTML = 'Loading publishers...';

                try {
                    const publishersResponse = await fetch(`http://localhost:3000/api/boardgames/${gameId}/publishers`, {
                        headers: {
                            'x-api-key': 'debug-api-key',
                            'Accept': 'application/json'
                        }
                    });

                    if (!publishersResponse.ok) {
                        publishersDiv.innerHTML = 'Given title is not a boardgame but some promo card or additional content to the given boardgame.';
                    }
                    else {

                    
                        const publishersData = await publishersResponse.json();
                        const publishers = publishersData.publishers;
                        publishersDiv.innerHTML = '<h2>Publishers</h2>';

                        publishers.forEach(publisher => {
                            const publisherDiv = document.createElement('div');
                            publisherDiv.classList.add('publisher-item');
                            publisherDiv.innerHTML = `<p>${publisher.name}</p>`;
                            publishersDiv.appendChild(publisherDiv);
                        });
                    }
                } catch (error) {
                    publishersDiv.innerHTML = `Error: ${error.message}`;
                }
            });
        });
    } catch (error) {
        outputDiv.innerHTML = `Error: ${error.message}`;
    }
});