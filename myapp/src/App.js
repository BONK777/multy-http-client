import React, { useState, useEffect } from 'react';
import Downloader from './Downloader';
import AddUrlForm from './AddUrlForm';

function App() {
  const [ws, setWs] = useState(null);
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setWs(ws);
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'added':
          setDownloads([...downloads, data.url]);
          break;
        case 'error':
          console.error(data.message);
          break;
        default:
          break;
      }
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setWs(null);
    };
  }, []);

  function handleAdd(url) {
    setDownloads([...downloads, url]);
  }

  return (
    <div>
      <AddUrlForm ws={ws} onAdd={handleAdd} />
      {downloads.map((downloadUrl) => (
        <Downloader key={downloadUrl} url={downloadUrl} ws={ws} />
      ))}
    </div>
  );
}

export default App;
