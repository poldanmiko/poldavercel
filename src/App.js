import React, { useState, useEffect } from "react";

function App() {
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleButtonClick = async (buttonId) => {
    if (queue.includes(buttonId)) {
      console.log(`Tombol ${buttonId} sudah ada dalam antrian`);
      return;
    }

    try {
      const response = await fetch(
        "https://due-ibby-individual-65-cb3662a6.koyeb.app/lockfile.php?cek=yes"
      );
      const data = await response.text();
      const isLocked = data === "1";

      if (isLocked) {
        setQueue((prevQueue) => [...prevQueue, buttonId]);
      } else {
        const url = `http://47.128.237.174/mandalorian/luciurl3.php?urutan-${buttonId}`;
        console.log(`Membuka website untuk tombol ${buttonId}`);
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error fetching lock status:", error);
      setQueue((prevQueue) => [...prevQueue, buttonId]);
    }
  };

  const processQueue = async () => {
    if (queue.length === 0) return;

    setIsProcessing(true);

    try {
      const currentButtonId = queue[0];

      const response = await fetch(
        "https://due-ibby-individual-65-cb3662a6.koyeb.app/lockfile.php?cek=yes"
      );
      const data = await response.text();
      const isLocked = data === "1";

      if (!isLocked) {
        const url = `http://47.128.237.174/mandalorian/luciurl3.php?urutan=${currentButtonId}`;
        console.log(`Membuka website untuk tombol ${currentButtonId}`);

        const hiddenElement = document.createElement("span");
        document.body.appendChild(hiddenElement);
        hiddenElement.addEventListener("click", () => {
          window.open(url, "_blank");
        });
        hiddenElement.click();
        document.body.removeChild(hiddenElement);

        setQueue((prevQueue) => prevQueue.slice(1));
      }
    } catch (error) {
      console.error("Error fetching lock status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let timeoutId;

    if (!isProcessing && queue.length > 0) {
      timeoutId = setTimeout(() => {
        processQueue();
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [queue, isProcessing]);

  return (
    <div>
      {[...Array(8)].map((_, index) => (
        <button key={index} onClick={() => handleButtonClick(index + 1)}>
          Tombol {index + 1}
        </button>
      ))}
      <p>Antrian: {queue.join(", ")}</p>
    </div>
  );
}

export default App;