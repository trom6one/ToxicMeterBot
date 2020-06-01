const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const tmi = require('tmi.js');

const http = require('http');



var request = require('request');







process.env.BOT_USERNAME = 'ToxicMeterBot';
process.env.OAUTH_TOKEN = 'oauth:g2lyyqo0pkzd3swu3pfzvhj3xsq8jh';
process.env.CHANNEL_NAME = 'trom666one';

const client_id = 'cu6xkebsgerd6ikki3cq08ov1koygc';

//let channels = {174360102:'trom666one'}

// Define configuration options
var opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    // process.env.CHANNEL_NAME // TODO -------------------------------
  ]
};

var json_channels = {
  "0":
    {
      "name": "00-00-00"
    }
};

app.listen(port, () => {
  console.log(`Express listening on ${port}`);
});


























// страница для инициализации бота 
app.get('/activate?:channel', function(req, res) {
  var channel = req.query.channel;
  
  console.log(`channel = ${req.query.channel}`); //////////
  console.log(`json_channels >= ${json_channels}`); /////////
  console.log(`json_channels['666'].name >= ${json_channels['666'].name}`); /////////

  // TODO Проверять статус подключения ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Если подключился, добавлять в список
    // Если не подключился, пробовать снова до N раз
  // По окончанию отправлять ответ клиент в виде статуса подключения
  if (channel in json_channels) {
    if (json_channels[channel]['active'] == 1){ // TODO Проверка через tmi.client и внутри запроса
      console.log('Bot already active'); //////////
      res.sendStatus(500);
    }
  }
  else{
    request(`https://api.twitch.tv/kraken/channels?client_id=${client_id}&api_version=5&id=${channel}`, function (error, res, body) { 

      var name = JSON.parse(body).channels[0].name;

      json_channels[channel] = {"name": name};
  
      console.log(`json_channels => ${JSON.stringify(json_channels)}`); /////////
  
      opts['channels'] = [json_channels[channel]['name']];

      client.options = opts;

      client.connect();
    })
  }

  res.sendStatus(200);
})
























// страница для инициализации бота 
app.get('/deactivate?:channel', function(req, res) {
  var channel = req.query.channel;
  
  console.log(`channel = ${req.query.channel}`); //////////
  console.log(`json_channels >= ${json_channels}`); /////////
  console.log(`json_channels['666'].name >= ${json_channels['666'].name}`); /////////


  // TODO Проверять находится ли канал в списке
    // Если в списке, проверить наличие активного подключения
      // Если подключен, отключить
    // Если нет в списке, отправить ответ
  // По окончанию, отправить ответ
  if (channel in json_channels) {
    if (json_channels[channel]['active'] == 1){
      console.log('Bot already active'); //////////
      res.sendStatus(500);
    }
  }
  else{
    request(`https://api.twitch.tv/kraken/channels?client_id=${client_id}&api_version=5&id=${channel}`, function (error, res, body) { 
      // if (!error && res.statusCode == 200) {   
      //   var parsed_body = JSON.parse(body);      
      //   name = parsed_body.channels[0].name;
      // }
      // else{
      //   console.log(`request error = ${error}`); ///////////
      //   console.log(`request res.statusCode = ${res.statusCode}`); //////////
      // }
       
      // var parsed_body = JSON.parse(body);  

      var name = JSON.parse(body).channels[0].name;

      json_channels[channel] = {"name": name, "active": 1};
  
      console.log(`json_channels => ${JSON.stringify(json_channels)}`); /////////
  
      // TODO Проверить коннект бота к каналам с заменой opts.channels
      opts['channels'] = [json_channels[channel]['name']];
      // client.options.channels = [name];
      client.options = opts;
      // TODO Проверить коннект бота к каналам с добавлением каналов 
      // будет ли повторно подключаться или скипнет ?
      // opts.channels.push(json[channel].name);
      //
      client.disconnect();
    })
  }

  res.sendStatus(200);
})


































// страница для отключения бота
app.get('/deactivate', function(req, res) {
  res.sendStatus(200);
})

// страница для настройки бота
app.get('/config/:channel', function(req, res) {
  var channel = req.params.channel;
  // var token = req.params.token;
  res.sendFile(__dirname + '/config.html', {channel: channel}); // , token: token
})






// Create a client with our options
const client = new tmi.client(opts);

// -- Register our event handlers (defined below)
client.on('connected', onConnectedHandler);

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// --
client.on('message', onMessageHandler);

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

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
function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}



// TODO Проверка все channels каждые n минут
// Если офлайн, отключить бота от канала
