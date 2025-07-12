const express = require('express');
const bodyParser = require('body-parser');
const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('Frontend'));


app.post('/overwrite-playlist', (req, res) => {
  const { filename, content } = req.body;
  const savePath = path.join(__dirname, 'playlists', filename);

  fs.writeFile(savePath, content, err => {
    if (err) {
      console.error('Error saving playlist:', err);
      return res.status(500).send('Failed to save');
    }
    res.send('Playlist saved successfully');
  });
});


  app.post('/switch-scene', async (req, res) => {
    const { scene } = req.body;
  
    try {
      await obs.connect('ws://localhost:4455', 'your_password'); // Use your password or leave blank if not
      await obs.call('SetCurrentProgramScene', { sceneName: scene });
      res.send(`Switched to scene: ${scene}`);
      await obs.disconnect();
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to switch scene');
    }
  });
  
  

// setup
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});