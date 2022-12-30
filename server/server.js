const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

const wss = new WebSocket.Server({ port: 8080 });

const downloads = new Map();

class Download {
  constructor(url) {
    this.url = url;
    this.status = 'pending';
    this.size = 0;
    this.threads = 0;
    this.progress = 0;
    this.filePath = null;
  }
}

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    const data = JSON.parse(message);
    if (data.type === 'start_download') {
      startDownload(data.url);
    }
  });
});

function startDownload(url) {
  if (downloads.has(url)) {
    return;
  }

  const download = new Download(url);

  const fileName = url.split('/').pop();
  download.filePath = `/downloads/${fileName}`;
  downloads.set(url, download);

  // Start downloading the file
  const file = fs.createWriteStream(download.filePath);
  https.get(url, (response) => {
    download.status = 'downloading';
    download.size = parseInt(response.headers['content-length'], 10);
    download.threads = 1;
    let downloaded = 0;
    response.pipe(file);

    response.on('data', (chunk) => {
      downloaded += chunk.length;
      download.progress = downloaded / download.size;

      // Send update to connected clients
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'download_progress',
            url: download.url,
            size: download.size,
            threads: download.threads,
            progress: download.progress,
            filePath: download.filePath,
          }),
        );
      });
    });

    file.on('finish', () => {
      file.close();
      download.status = 'completed';
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'download_completed',
            url: download.url,
            filePath: download.filePath,
          }),
        );
      });
    });

  })

}