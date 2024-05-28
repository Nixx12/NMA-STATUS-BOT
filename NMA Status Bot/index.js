// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { getServerInfo } = require('./serverStatus');
const dotenv = require('dotenv');

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

let updateStatusTimer;

client.on('messageCreate', async message => {
    if (message.content.toLowerCase() === '!seed') {
        try {
            getServerInfo((playerCount, mapName, serverCapacity) => {
                message.reply(`${playerCount}/${serverCapacity} | ${mapName}`);
                
                setBotStatus(playerCount, serverCapacity, mapName);
                
                restartStatusUpdateTimer();
            });
        } catch (error) {
            console.error('Error fetching server info:', error);
        }
    }
});

function setBotStatus(playerCount, serverCapacity, mapName) {
    // Format status message
    const statusMessage = `${playerCount}/${serverCapacity} | ${mapName}`;
    
    try {
        client.user.setActivity(statusMessage, { type: ActivityType.Watching });
        console.log(`Bot status set to: ${statusMessage}`)
    } catch(error) {
        console.log(`Error settings bot status, ${error}`)
    }
}

function startStatusUpdateTimer() {
    updateStatusTimer = setInterval(() => {
        getServerInfo((playerCount, mapName, serverCapacity) => {
            console.log(`Player count: ${playerCount}`);
            console.log(`Map name: ${mapName}`);
            console.log(`Server capacity: ${serverCapacity}`);
            
            setBotStatus(playerCount, serverCapacity, mapName);
        });
    }, 300000);
}

function restartStatusUpdateTimer() {
    clearInterval(updateStatusTimer);
    startStatusUpdateTimer();
}


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    startStatusUpdateTimer();
});

client.login(BOT_TOKEN);