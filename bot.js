const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const tmi = require('tmi.js');
//const http = require('http');
var request = require('request');

const client_id = 'cu6xkebsgerd6ikki3cq08ov1koygc';
const oauth_key = 'g2lyyqo0pkzd3swu3pfzvhj3xsq8jh';

process.env.BOT_USERNAME = 'ToxicMeterBot';
process.env.OAUTH_TOKEN = 'oauth:g2lyyqo0pkzd3swu3pfzvhj3xsq8jh';
process.env.CHANNEL_NAME = 'trom666one';


//let channels = {174360102:'trom666one'}

// Define configuration options
var opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    // process.env.CHANNEL_NAME
  ]
};

var json_channels = {
  "0": {
    "name": "0",
    "active": "0"
  }
};

app.listen(port, () => {
  console.log(`Express listening on ${port}`);
});




















const client = new tmi.client(opts);

// TODO Получаем сообщение от EBS
// TODO Подключаемся к каналу и отправляем сообщение в чат
// TODO Запукаем таймер на 10 минут
  // TODO Если стрим не активен, отключаемся от канала
  // TODO Если стрим активен, запускаем таймер еще на 10 минут


// страница для инициализации бота 
app.get('/toxic?channel&name', function (req, res) {
  var channelId = req.query.channel;
  var name = req.query.name;
  
  json_channels[channelId]['name'] = name;

  // TODO Проверять статус подключения
  // Если подключился, добавлять в список
  // Если не подключился, пробовать снова до N раз
  // По окончанию отправлять ответ клиент в виде статуса подключения

  // Returns one of the following states: "CONNECTING", "OPEN", "CLOSING" or "CLOSED".
  //console.log(client.readyState());

  opts['channels'] = [name]; // [json_channels[channelId]['name']];
  client.options = opts;

  // "CONNECTING", "OPEN", "CLOSING", "CLOSED"
  if(client.readyState() == "CLOSING"){
    initDelay(10000);
    client.connect();
  }

  if(client.readyState() == "CLOSED"){
    client.connect();
    initDelay(10000);
  }

  if(client.readyState() == "OPEN"){
    client.join(name)
    .then((data) => {

      console.log(`Join to ${name}, data = ${data}`);
      checkOnline(channelId, name);

    }).catch((err) => {

      console.log(`Join to ${name}, error = ${err}`);

    });
  }
});

async function initDelay(ms){
  await delay(ms);
}

function delay(ms){
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

function checkOnline(name){
  var stream = null;
  client.api({
    url: `https://api.twitch.tv/kraken/streams/${channelId}`,
    method: "GET",
    headers: {
        "Accept": "application/vnd.twitchtv.v5+json",
        "Authorization": `OAuth ${oauth_key}`,
        "Client-ID": client_id
    }
  }, (err, res, body) => {
      console.log(body);
      stream = JSON.parse(body).stream;
  });

  if(stream == null){
    client.part(name)
    .then((data) => {
      console.log(`Part from ${name}, data = ${data}`);
    }).catch((err) => {
      console.log(`Part from ${name}, error = ${err}`);
    });
  } else {
    initDelay(10000);
    checkOnline(name);
  }
}






client.on("connecting", (address, port) => {
  // Do your stuff.
  console.log(`Bot is connecting`);
  console.log(address);
  console.log(port);
});

client.on("connected", (address, port) => {
  // Do your stuff.
  console.log(`Bot connected`);
  console.log(address);
  console.log(port);
});

client.on("disconnected", (reason) => {
  // Do your stuff.
  console.log(`Bot disconnected`);
  console.log(reason);
});

client.on("emoteonly", (channel, enabled) => {
  // Do your stuff.
  console.log(`Emote only`);
  console.log(channel);
  console.log(enabled);
});

client.on("followersonly", (channel, enabled, length) => {
  // Do your stuff.
  console.log(`Followers only`);
  console.log(channel);
  console.log(enabled);
  console.log(length);
});

client.on("hosting", (channel, target, viewers) => {
  // Do your stuff.
  console.log(`Hosting`);
  console.log(channel);
  console.log(target);
  console.log(viewers);
});

client.on("logon", () => {
  // Do your stuff.
  console.log(`Logon`);
});





// страница для настройки бота
app.get('/config/:channel', function (req, res) {
  var channel = req.params.channel;
  // var token = req.params.token;
  res.sendFile(__dirname + '/config.html', {
    channel: channel
  }); // , token: token
})






// Create a client with our options
// const client = new tmi.client(opts);

// -- Register our event handlers (defined below)
// client.on('connected', onConnectedHandler);

// Called every time the bot connects to Twitch chat
// function onConnectedHandler(addr, port) {
//   console.log(`* Connected to ${addr}:${port}`);
// }

// --
client.on('message', onMessageHandler);

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  console.log(`target = ${target}`);

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!d20') {
    const num = rollDice(commandName);
    client.say(target, `You rolled a ${num}.`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Connect to Twitch:
//client.connect();

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}



// TODO Проверка все channels каждые n минут
// Если офлайн, отключить бота от канала