const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();

exports.connectOBS = async (password) => {
  if (!obs.isConnected) {
    await obs.connect('ws://localhost:4455', password);
  }
};

exports.switchScene = async (scene) => {
  await obs.call('SetCurrentProgramScene', { sceneName: scene});
};

exports.disconnectOBS = async () => {
  if (obs.isConnected) {
    await obs.disconnect();
  }
};