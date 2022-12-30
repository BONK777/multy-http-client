const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const downloads = {};

wss.on('connection', (ws) => {
  console.log('WebSocket connection opened');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'add':
        if (downloads[data.url]) {
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'URL is already being downloaded',
            }),
          );
        } else {
          downloads[data.url] = {
            url: data.url,
            size: 0,
            threads: 0,
            progress: 0,
            file: null,
          };
          ws.send(
            JSON.stringify({
              type: 'added',
              url: data.url,
            }),
          );
          // Start downloading the content here
        }
        break;
      case 'get':
        if (downloads[data.url]) {
          ws.send(
            JSON.stringify({
              type: 'status',
              url: data.url,
              status: downloads[data.url],
            }),
          );
        } else {
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'URL is not being downloaded',
            }),
          );
        }
        break;
      default:
        break;
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});
