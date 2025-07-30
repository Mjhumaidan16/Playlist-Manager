const obsService = require('../services/obsService');

exports.switchScene = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { scene, password } = JSON.parse(body);
      if (!scene || !password) {
        res.writeHead(400);
        return res.end('Missing scene or password');
      }

      await obsService.connectOBS(password);
      await obsService.switchScene(scene);

      res.writeHead(200);
      res.end(`Switched to scene: ${scene}`);
    } catch (err) {
      console.error('Controller error:', err);
      res.writeHead(500);
      res.end('Failed to switch scene');
    }
  });
};


exports.connectOBS = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { scene, password } = JSON.parse(body);
      if (!scene || !password) {
        res.writeHead(400);
        return res.end('Missing scene or password');
      }

      await obsService.connectOBS(password);

    }  catch (err) {
      console.error('Controller error:', err);
      res.writeHead(500);
      res.end('Failed to switch scene');
    }
  });
};

