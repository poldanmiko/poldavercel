import React, { useState, useEffect } from 'react';

function App() {
    const [queue, setQueue] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lockStatus, setLockStatus] = useState(true); // Awalnya terkunci

  const handleButtonClick = (buttonId) => {
    setQueue([...queue, buttonId]);
    processQueue();
  };

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    const currentButtonId = queue[0];

    if (!lockStatus) {
      console.log(`Membuka website untuk tombol ${currentButtonId}`);
      window.open('https://example.com', '_blank');

      setQueue(queue.slice(1));

      setTimeout(() => {
        setLockStatus(true);
        setIsProcessing(false); 
        processQueue();
      }, 3000);
    } else {
      setTimeout(() => {
        processQueue();
      }, 1000);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
        try {
            const response = await fetch('https://due-ibby-individual-65-cb3662a6.koyeb.app/lockfile.php?cek=yes');
            const data = await response.text();
            //  console.log("response :", data);
            setLockStatus(data === '1');
          } catch (error) {
            console.error('Error fetching lock status:', error);
            // Tangani error, misalnya dengan menampilkan pesan error atau retry
          }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!lockStatus) {
      processQueue();
    }
  }, [lockStatus]);

  return (
    <div>
      {[...Array(8)].map((_, index) => (
        <button key={index} onClick={() => handleButtonClick(index + 1)}>
          Tombol {index + 1}
        </button>
      ))}
      <p>Antrian: {queue.join(', ')}</p>
      <p>Status Lock: {lockStatus ? 'Terkunci' : 'Terbuka'}</p>
    </div>
  );
}

export default App;