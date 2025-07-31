const http = require('http');
const router = require('./router');
const { PORT } = require('./config');
const readline = require('readline');
const fs = require('fs');


// Terminal prompt setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// Prompt user for Stream URL
rl.question('Enter your Stream URL: ', (streamUrl) => {
  // Prompt user for Stream Key
  rl.question('Enter your Stream Key: ', (streamKey) => {
    rl.close(); // Close readline interface after both inputs

    // Read the existing .env file to preserve other variables
    let envContent = fs.readFileSync('.env', 'utf8');

    // Update or append the new values to the .env content
    const streamUrlRegex = /STREAM_URL=.*/;
    const streamKeyRegex = /STREAM_KEY=.*/;

    if (streamUrlRegex.test(envContent)) {
      envContent = envContent.replace(streamUrlRegex, `STREAM_URL=${streamUrl}\n`);
    } else {
      envContent += `STREAM_URL=${streamUrl}\n`;
    }

    if (streamKeyRegex.test(envContent)) {
      envContent = envContent.replace(streamKeyRegex, `STREAM_KEY=${streamKey}`);
    } else {
      envContent += `STREAM_KEY=${streamKey}\n`;
    }

    // Write the updated content back to the .env file without overwriting the whole file
    fs.writeFileSync('.env', envContent, 'utf8');

    console.log('✅ OBS stream settings applied and saved to .env file.');
    
    require('dotenv').config();

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
});
});
