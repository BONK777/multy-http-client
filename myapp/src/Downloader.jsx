import React, { useState, useEffect } from 'react';

const Downloader = (props) => {
  const [url, setUrl] = useState('');
  const [download, setDownload] = useState(null);
  const [rangesSupported, setRangesSupported] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(props.wsServerUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'download_progress') {
        setDownload(data);
      } else if (data.type === 'download_completed') {
        setDownload(data);
      }
    };

    ws.onopen = () => {
      const req = new XMLHttpRequest();
      req.open('HEAD', url);
      req.onload = () => {
        setRangesSupported(req.getResponseHeader('Accept-Ranges') === 'bytes');
      };
      req.send();
    };

    return () => {
      ws.close();
    };
  }, [url, props.wsServerUrl]);

  const startDownload = () => {
    const ws = new WebSocket(props.wsServerUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'download_progress') {
        setDownload(data);
      } else if (data.type === 'download_completed') {
        setDownload(data);
      }
    };

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
