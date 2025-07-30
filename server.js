const http = require('http');

const PORT = 3000;
let obsPassword = '';

const server = http.createServer((req, res) => {

if (req.method == 'GET'){

const filePath = req.url == '/' ? 'index.html' : req.url;
const fullPath = path.join(__dirname, 'Frontend', filePath);

fs.readFile(fullPath, (err, data) => {
  if (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.m3u': 'audio/x-mpegurl',
    '.m3u8': ''
  };

  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
  res.end(data);
});

}

// 1. Handle password receiving
else if (req.method === 'POST' && req.url === '/api/obs-password') {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    try {
      const { password } = JSON.parse(body);
      if (!password) throw new Error('Missing password');
      obsPassword = password;

      // ✅ Connect only after receiving password
      try {
        await obs.connect('ws://localhost:4455', obsPassword );
        console.log('Connected to OBS!');
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'Connected' }));
      } catch (err) {
        console.error('OBS connection failed:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'OBS connection failed', detail: err.message }));
      }
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Bad request' }));
    }
  });
}





else if (req.method === 'POST' && req.url === '/switch-scene') {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      console.log('OBS Password:', password);
      const { scene } = JSON.parse(body);
      await obs.connect('ws://localhost:4455',password);
      await obs.call('SetCurrentProgramScene', { sceneName: scene });
      await obs.disconnect();

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Switched to scene: ${scene}`);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to switch scene');
    }
  });
}



else if (req.method === 'POST' && req.url === '/overwrite-playlist') {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { filename, content } = JSON.parse(body);
      const savePath = path.join(__dirname, 'playlists', filename);

      fs.writeFile(savePath, content, err => {
        if (err) {
          console.error('Failed to save playlist:', err);
          res.writeHead(500);
          return res.end('Failed to save');
        }

        res.writeHead(200);
        res.end('Playlist saved successfully');
      });
    } catch (err) {
      console.error(err);
      res.writeHead(400);
      res.end('Invalid request');
    }
  });

  
}

else {
  res.writeHead(404);
  res.end('Not Found');
}


});


  
  // setup
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});