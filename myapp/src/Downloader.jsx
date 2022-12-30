import React, { useState, useEffect } from 'react';

const Downloader = (props) => {
  const [url, setUrl] = useState('');
  const [download, setDownload] = useState(null);
  const [rangesSupported, setRangesSupported] = useState(false);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket(props.wsServerUrl);

    // Set up message event listener
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'download_progress') {
        setDownload(data);
      } else if (data.type === 'download_completed') {
        setDownload(data);
      }
    };

    // Check if ranges are supported
    ws.onopen = () => {
      const req = new XMLHttpRequest();
      req.open('HEAD', url);
      req.onload = () => {
        setRangesSupported(req.getResponseHeader('Accept-Ranges') === 'bytes');
      };
      req.send();
    };

    // Disconnect from WebSocket server when component unmounts
    return () => {
      ws.close();
    };
  }, [url, props.wsServerUrl]);

  const startDownload = () => {
    // Connect to WebSocket server
    const ws = new WebSocket(props.wsServerUrl);

    // Set up message event listener
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'download_progress') {
        setDownload(data);
      } else if (data.type === 'download_completed') {
        setDownload(data);
      }
    };

    // Send message to start download when URL is entered
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'start_download',
          url,
        }),
      );
    };
  };

  return (
    <div>
      <input value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={startDownload}>Start Download</button>
      {download && (
        <div>
          <p>Status: {download.status}</p>
          <p>Size: {download.size}</p>
          {rangesSupported && (
            <p>Threads: {download.threads}</p>
          )}
          {download.status === 'completed' && (
            <a href={download.fileUrl}>Download completed</a>
          )}
        </div>
      )}
    </div>
  );
};

export default Downloader;
