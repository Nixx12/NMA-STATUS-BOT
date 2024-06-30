const nodeFetch = 'node-fetch';
const dotenv = require('dotenv');

dotenv.config();
1
const SERVER_ID = process.env.SERVER_ID;


async function getServerInfo(callback) {
    const url = `https://api.battlemetrics.com/servers/${SERVER_ID}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const playerCount = data.data.attributes.players;
        let mapName = data.data.attributes.details.map;
        let gamemode = data.data.attributes.details.gameMode;
        const serverCapacity = data.data.attributes.maxPlayers;

        mapName = mapName.replace(/_/g, ' ');

        callback(playerCount, mapName, gamemode, serverCapacity);
    } catch (error) {
        console.error('Error fetching server info:', error);
    }
}

module.exports = {
    getServerInfo
};