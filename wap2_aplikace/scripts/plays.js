const PORT = 3000;

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
        const response = await fetch(`http://localhost:${PORT}/api/plays/${gameId}?fromdate=${fromDate}&todate=${toDate}`, {
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


document.getElementById('playsSummary').addEventListener('click', async () => {
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
        const response = await fetch(`http://localhost:${PORT}/api/plays/${gameId}/summary?fromdate=${fromDate}&todate=${toDate}`, {
            headers: {
                'x-api-key': 'debug-api-key',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        outputDiv.innerHTML = `
            <h2>Plays Summary</h2>
            <p><strong>Total Plays:</strong> ${data.totalPlays}</p>
            <p><strong>Total Play Time:</strong> ${data.playTimeStats.totalPlayTime} minutes</p>
            <p><strong>Non-Zero Time Play Count:</strong> ${data.playTimeStats.nonZeroPlayCount}</p>
            <p><strong>Max Play Time:</strong> ${data.playTimeStats.maxPlayTime} minutes</p>
            <p><strong>Min Play Time:</strong> ${data.playTimeStats.minPlayTime} minutes</p>
            <p><strong>Average Play Time:</strong> ${data.playTimeStats.averagePlayTime.toFixed(2)} minutes</p>
            <p><strong>Unique Players:</strong> ${data.uniquePlayers}</p>
            <p><strong>Date Range:</strong> From ${data.dateRange.from} to ${data.dateRange.to}</p>
        `;
    } catch (error) {
        outputDiv.innerHTML = `Error: ${error.message}`;
    }
});

document.getElementById('playsWinrate').addEventListener('click', async () => {
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
        const response = await fetch(`http://localhost:${PORT}/api/plays/${gameId}/winrate?fromdate=${fromDate}&todate=${toDate}`, {
            headers: {
                'x-api-key': 'debug-api-key',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const winrateList = Object.entries(data.winCounts)
            .map(([key, value]) => `<li><strong>${key.replace('playerwinrate', ' Player Wins')}:</strong> ${value}</li>`)
            .join('');

        outputDiv.innerHTML = `
            <h2>Winrate Summary</h2>
            <p><strong>Plays Players Recorded:</strong> ${data.playersRecordedLen}</p>
            <p><strong>Win Counts:</strong></p>
            <ul>${winrateList}</ul>
        `;
    } catch (error) {
        outputDiv.innerHTML = `Error: ${error.message}`;
    }
});

document.getElementById('playsDaily').addEventListener('click', async () => {
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
        const response = await fetch(`http://localhost:${PORT}/api/plays/${gameId}/daily?fromdate=${fromDate}&todate=${toDate}`, {
            headers: {
                'x-api-key': 'debug-api-key',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const dailyCounts = Object.entries(data.dailyPlayCount)
            .map(([date, count]) => `<li>${date}: ${count} plays</li>`)
            .join('');

        outputDiv.innerHTML = `
            <h2>Daily Play Counts</h2>
            <p><strong>Total Play Count:</strong> ${data.totalPlayCount}</p>
            <ul>${dailyCounts}</ul>
        `;
    } catch (error) {
        outputDiv.innerHTML = `Error: ${error.message}`;
    }
});