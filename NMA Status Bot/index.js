const { Client, GatewayIntentBits } = require('discord.js');
const { getServerInfo } = require('./serverStatus');
const dotenv = require('dotenv');

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var date = new Date().toLocaleString();

let updateStatusTimer;

function setBotStatus(playerCount, serverCapacity, mapName, gamemode) {
    const statusMessage = `${playerCount}/${serverCapacity} | ${mapName} | ${gamemode}\nDeveloped By Nixx`;
    
    try {
        client.user.setActivity(`${statusMessage}`);
        console.log(`Bot status set to: ${statusMessage}`)
        console.log(date)
    } catch(error) {
        console.log(`Error settings bot status, ${error}`)
        setTimeout(() => {
            startStatusUpdateTimer();
        }, 5000);
    }
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