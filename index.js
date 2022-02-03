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
let botStatusType;

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
        'Log in to your Discord Bot! (Using DJS)'
    );
    
    await sleep();
    rainbowTitle.stop();
}

/** 
 * Prompts your for things that is important to start the bot
 */
async function askBotInfo() {
    const answers = await inquirer.prompt({
        name: 'bot_token',
        type: 'password',
        message: 'What is your bot\'s token?'
    });
    
    if(!answers.bot_token) {
        console.log('You did not put the bot\'s token');
        process.exit(1);
    }
    
    const botStatus = await inquirer.prompt({
        name: 'bot_status_name',
        type: 'input',
        message: 'Bot Status (Name)',
        default() {
            return false;
        }
    });
    
    if (botStatus.bot_status_name) {
        const botStatusTypeQ = await inquirer.prompt({
            name: 'bot_status_type',
            type: 'list',
            message: 'Bot Status type?',
            choices: [
                "PLAYING",
                "LISTENING",
            ]
        });
        
        botStatusType = botStatusTypeQ.bot_status_type;
    }
    
    botToken = answers.bot_token;
    botStatusName = botStatus.bot_status_name;
    
    await startBot(botToken);
}


/** 
 * Starts your bot
 * @param {string} token
 */
async function startBot(token) {
    const spinner = createSpinner('Logging in to the bot').start();
    
    client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
        ],
    });
    
    try {
        await client.login(`${token}`);
        spinner.success({ text: `Successfully Logged in to the Bot (as ${client.user.tag})` });
        
        if(botStatusName && botStatusType) await client.user.setActivity(botStatusName, { type: botStatusType });
    } catch (err) {
        spinner.error({ text: 'Invalid Token Provided' });
        console.log(err);
        await sleep(1000);
        process.exit(1);
    }
}

await welcome();
await askBotInfo();