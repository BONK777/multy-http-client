import React from 'react';
import Downloader from './Downloader';

const App = () => {
  const wsServerUrl = 'ws://localhost:8080';

  return (
    <div>
      <Downloader wsServerUrl={wsServerUrl} />
    </div>
  );
};

export default App;
