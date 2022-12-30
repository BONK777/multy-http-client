import React, { useState, useEffect } from 'react';

function Downloader({ url, threads, speedLimit }) {
  const [supported, setSupported] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkRangesSupport() {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
        });
        const acceptsRanges = response.headers.get('Accept-Ranges');
        setSupported(acceptsRanges === 'bytes');
      } catch (err) {
        setError(err);
      }
    }
    checkRangesSupport();
  }, [url]);

  async function startDownload() {
    setDownloading(true);
    setError(null);
    try {
      const chunkSize = Math.ceil(speedLimit / threads);
      const promises = [];
      for (let i = 0; i < threads; i += 1) {
        promises.push(downloadChunk(i * chunkSize, (i + 1) * chunkSize - 1));
      }
      await Promise.all(promises);
    } catch (err) {
      setError(err);
    }
    setDownloading(false);
  }

  async function downloadChunk(start, end) {
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const response = await fetch(proxyUrl + url, {
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      });
      const chunk = await response.arrayBuffer();
      setDownloaded(downloaded + chunk.byteLength);
    } catch (err) {
      setError(err);
    }
  }

  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }
  if (supported === null) {
    return <p>Checking if ranges are supported...</p>;
  }
  if (supported === false) {
    return <p>Ranges are not supported for this URL</p>;
  }
  return (
    <div>
      <p>Ranges are supported</p>
      {downloading ? (
        <div>
          <p>Downloading...</p>
          <p>{downloaded} bytes downloaded</p>
          <progress value={downloaded} max={100} />
        </div>
      ) : (
        <button onClick={startDownload}>Start download</button>
      )}
    </div>
  );
}

export default Downloader;
