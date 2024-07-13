const { Client, GatewayIntentBits } = require('discord.js');
const { getServerInfo } = require('./serverStatus');
const dotenv = require('dotenv');

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let updateStatusTimer;
let currentStatusMessage = '';

function setBotStatus(playerCount, serverCapacity, mapName, gamemode) {
    const statusMessage = `${playerCount}/${serverCapacity} | ${mapName} | ${gamemode} - Developed By Nixx`
    currentStatusMessage = statusMessage;

    var date = new Date().toLocaleString();
    try {
        client.user.setActivity(`${statusMessage}`);
        console.log(`Bot status set to: ${statusMessage}`)
        console.log(`Current Time: ${date}`)
    } catch(error) {
        console.log(`Error setting bot status: ${error}`)
        setTimeout(() => {
            startStatusUpdateTimer();
        }, 5000);
    }
    return statusMessage;
}

function startStatusUpdateTimer() {
    getServerInfo((playerCount, mapName, gamemode, serverCapacity) => { 
        setBotStatus(playerCount, serverCapacity, mapName, gamemode);
    });

    updateStatusTimer = setInterval(() => {
        getServerInfo((playerCount, mapName, gamemode, serverCapacity) => {
            setBotStatus(playerCount, serverCapacity, mapName, gamemode);
        });
    }, 30000);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    startStatusUpdateTimer();
});

client.login(BOT_TOKEN);