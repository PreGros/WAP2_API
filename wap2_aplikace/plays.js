document.getElementById('fetchData').addEventListener('click', async () => {
    const outputDiv = document.getElementById('output');
    const gameId = document.getElementById('gameId').value.trim();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const fromDate = document.getElementById('fromDate').value.trim() || yesterday.toISOString().split('T')[0];
    const toDate = document.getElementById('toDate').value.trim() || today.toISOString().split('T')[0];

    if (!gameId) {
        outputDiv.innerHTML = 'Please enter a valid Game ID.';
        return;
    }

    outputDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch(`http://localhost:3000/api/plays/${gameId}?fromdate=${fromDate}&todate=${toDate}`, {
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
            outputDiv.innerHTML = 'No plays found for the given date range.';
            return;
        }

        data.forEach(play => {
            const playDiv = document.createElement('div');
            playDiv.classList.add('play-item');

            playDiv.innerHTML = `
                <h2>Play ID: ${play.id}</h2>
                <p><strong>Date:</strong> ${new Date(play.date).toLocaleDateString()}</p>
                <p><strong>Length:</strong> ${play.length} minutes</p>
            `;
            
            if (play.comments) {
                playDiv.innerHTML += `\n<p><strong>Comments:</strong> ${play.comments}</p>`
            }

            if (play.players && play.players.length > 0) {
                const playersList = document.createElement('ul');
                playersList.classList.add('players-list');

                play.players.forEach(player => {
                    const playerItem = document.createElement('li');
                    playerItem.innerHTML = `
                        <strong>Name:</strong> ${player.name} 
                        <strong>User ID:</strong> ${player.userid} 
                        <strong>Win:</strong> ${player.win === "1" ? "Yes" : "No"}
                    `;
                    playersList.appendChild(playerItem);
                });

                const playersHeader = document.createElement('p');
                playersHeader.innerHTML = '<strong>Players:</strong>';
                playDiv.appendChild(playersHeader);
                playDiv.appendChild(playersList);
            }

            outputDiv.appendChild(playDiv);
        });
    } catch (error) {
        outputDiv.innerHTML = `Error: ${error.message}`;
    }
});