const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();


exports.connectOBS = async (password) => {
  if (!obs.isConnected) {
    
    const obsWeb = process.env.OBS_HOST;
    const password = process.env.OBS_PASSWORD;
    await obs.connect(obsWeb, password);
  }
};

exports.switchScene = async (scene) => {
  await obs.call('SetCurrentProgramScene', { sceneName: scene});
};

exports.disconnectOBS = async () => {
  if (obs.isConnected) {
    await obs.disconnect();
  };

}

exports.startStream = async () => {
 try {
    if (!obs.isConnected) {
      console.log('OBS not connected. Connecting now...');
       await exports.connectOBS();
    }

    const streamUrl = process.env.STREAM_URL;
    const streamKey = process.env.STREAM_KEY;

    await obs.call('SetOutputSettings', {
      outputName: 'YouTube-RTMPS',
      outputSettings: {
        server: streamUrl,
        key: streamKey,
      },
    });

    await obs.call('StartStream');
  } catch (err) {
    // Propagate error to controller
    throw err;
  }
};

exports.stopStream = async () => {
  if (!obs.isConnected) {
    throw new Error('OBS is not connected');
  }

  console.log('Stopping stream');

  try {
    await obs.call('StopStream');
  } catch (err) {
    console.error('Error stopping stream:', err);
    throw err; // re-throw to be handled by the caller
  }
};


