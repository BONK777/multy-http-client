// import React, { useState } from 'react';

// function AddUrlForm({ ws, onAdd }) {
//   const [url, setUrl] = useState('');

//   function handleSubmit(event) {
//     event.preventDefault();
//     if (!ws) {
//       console.error('WebSocket connection is not open');
//       return;
//     }
//     ws.send(
//       JSON.stringify({
//         type: 'add',
//         url,
//       }),
//     );
//     onAdd(url);
//     setUrl('');
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={url}
//         onChange={(event) => setUrl(event.target.value)}
//       />
//       <button type="submit">Add URL</button>
//     </form>
//   );
// }

// export default AddUrlForm;
