const http = require('http');
const router = require('./router');
const { PORT } = require('./config');
require('dotenv').config();
const readline = require('readline');

// Terminal prompt setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for Stream URL and Stream Key
rl.question('Enter your Stream URL: ', (streamUrl) => {
  streamUrl = process.env.STREAM_URL;
  rl.question('Enter your Stream Key: ', async (streamKey) => {
  streamKey = process.env.STREAM_Key;
    rl.close(); // close prompt

        console.log('✅ OBS stream settings applied.');


const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
});
});
