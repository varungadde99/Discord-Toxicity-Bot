const Discord = require("discord.js");
require("dotenv").config();
require("@tensorflow/tfjs");

const client = new Discord.Client();
const toxicity = require("@tensorflow-models/toxicity");
const { Identity } = require("@tensorflow/tfjs-core");
const threshold = 0.9;
let model;

// When the Server and Bot is online, load the Toxicity Model for each user.
client.on("ready", async () => {
    model = await toxicity.load(threshold);
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {

    // Checking messages of users, other than bot. 
    if (msg.author.bot) return;

    // Extracting content from the message.
    text = msg.content;

    // Load the model. 
    // Users optionally pass in a threshold and an array of labels to include.
    let predictions = await model.classify(text);
    predictions.forEach((element) => {
        if (element.results[0].match) {
            msg.reply(
                // Two types of attacks - Toxicity and Insult.
                `Warning! Found ${element.label} in your previous message. Please delete it.`
            );
        }
    });
});

// TOKEN auth to identify the Discord Bot
client.login(process.env['TOKEN']);

