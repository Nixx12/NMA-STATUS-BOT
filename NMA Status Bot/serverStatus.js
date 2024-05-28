const nodeFetch = 'node-fetch'
const dotenv = require('dotenv');

dotenv.config()

const API_KEY = process.env.API_KEY;
const SERVER_ID = process.env.SERVER_ID;


async function getServerInfo(callback) {
    const url = `https://api.battlemetrics.com/servers/${SERVER_ID}`;
    const headers = {
        'Authorization': `Bearer ${API_KEY}`
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const playerCount = data.data.attributes.players;
        let mapName = data.data.attributes.details.map;
        const serverCapacity = data.data.attributes.maxPlayers;

        mapName = mapName.replace(/_/g, ' ');

        callback(playerCount, mapName, serverCapacity);
    } catch (error) {
        console.error('Error fetching server info:', error);
    }
}

module.exports = {
    getServerInfo
};