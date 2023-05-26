import express from "express";
import bodyParser from 'body-parser';
import { ChatGPTAPI } from 'chatgpt'
import { Configuration, OpenAIApi } from 'openai';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(80, () => {
  console.log("Project is running!");
})

app.get("/", (req, res) => {
  res.send("ChatGPTBot running");
  const mySecret = process.env['token']
})

import Discord from "discord.js";
import { GatewayIntentBits, Partials } from 'discord.js';
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.MessageReaction,
    Partials.User,
    Partials.GuildMessages,
    Discord.PartialGroupDMChannel
  ]
});

client.on('messageCreate', async (message) => {
  console.log(message);
  if (message && message.content && !message.author.bot) {
    
    let content = message.content;

    if(!content.startsWith('/')) {
      const api = new ChatGPTAPI({
        apiKey: process.env['chatGPTApiKey']
      });
      const res = await api.sendMessage(content);  //send message to ChatGPT
      message.channel.send(res.text);  //send message to discord chat
    } else if (content.startsWith('/image')) {
      const configuration = new Configuration({
        apiKey: process.env['chatGPTApiKey']
      });
      const openai = new OpenAIApi(configuration);

      let parts = content.split(' ');
      parts.shift(); // parts is modified to remove first word
      let result;
      if (parts instanceof Array) {
        result = parts.join(' ');
      }
      else {
        result = parts;
      }

      if (result.startsWith('random')) {

        const api = new ChatGPTAPI({
          apiKey: process.env['chatGPTApiKey']
        });
        const res = await api.sendMessage("generate a random prompt for an image creation");  //request random text prompt from ChatGPT
        const response = await openai.createImage({  //generate image
          prompt: res.text,
          n: 1,
          size: '1024x1024',
        });
    
        const imageUrl = response.data.data[0].url;
        
        message.channel.send(res.text);  //send prompt result to discord chat
        message.channel.send(imageUrl);  //send message to discord chat
      } else {
        const response = await openai.createImage({  //generate image
          prompt: result,
          n: 1,
          size: '1024x1024',
        });
    
        const imageUrl = response.data.data[0].url;
        
        message.channel.send(result);  //send prompt result to discord chat
        message.channel.send(imageUrl);  //send message to discord chatmessage.channel.send(imageUrl);  //send message to discord chat
      }
    }
    
  }
})

client.on('ready', () => {
  console.log("ChatGPTBot is running...");
});

client.login(process.env['token']);