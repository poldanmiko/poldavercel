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
    if (isProcessing) return;

    setIsProcessing(true);
    const currentButtonId = queue[0];

    if (!lockStatus) {
      // Simulasi membuka website di tab baru
      console.log(`Membuka website untuk tombol ${currentButtonId}`);
      window.open('https://example.com', '_blank');

      setQueue(queue.slice(1));
      // Simulasi website selesai diproses setelah 3 detik
      setTimeout(() => {
        setLockStatus(true);
        setIsProcessing(false);
        processQueue();
      }, 3000);
    } else {
      // Simulasi cek lockStatus setiap 1 detik
      setTimeout(() => {
        setIsProcessing(false);
        processQueue();
      }, 1000);
    }
  };

  // Simulasi update lockStatus dari server setiap 5 detik
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://47.128.237.174/mandalorian/lockfile.php?cek=yes');
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
