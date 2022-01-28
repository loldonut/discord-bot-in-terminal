#!/usr/bin/env node

import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import {
    Client,
    Intents,
} from 'discord.js';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

let botToken;
let client;
let botStatusName;

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
        'Create a DJS Bot!'
    );
    
    await sleep();
    rainbowTitle.stop();
}

async function askBotInfo() {
    const answers = await inquirer.prompt({
        name: 'bot_token',
        type: 'input',
        message: 'What is your bot\'s token?'
    });
    
    const botStatus = await inquirer.prompt({
        name: 'bot_status_name',
        type: 'input',
        message: 'Bot Status',
        default() {
            return false;
        }
    });
    
    botToken = answers.bot_token;
    botStatusName = botStatus.bot_status_name;
    
    await startBot(botToken);
}

async function startBot(token) {
    const spinner = createSpinner('Logging in to the bot').start();
    await sleep()
    
    client = new Client({
        intents: [
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILDS,
        ],
    });
    
    try {
        client.login(`${token}`);
        spinner.success({ text: `Successfully Logged in to the Bot` });
    } catch (err) {
        spinner.error({ text: 'Invalid Token Provided' });
        console.log(err);
        process.exit(1);
    }
}

await welcome();
await askBotInfo();