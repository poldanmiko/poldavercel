import React, { useState, useEffect } from "react";

function App() {
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUrlOption, setSelectedUrlOption] = useState(1); // Default ke "SATU"

  const urlOptions = {
    1: "http://47.128.237.174/mandalorian/luciurl.php",
    2: "http://47.128.237.174/mandalorian/luciurl2.php",
    3: "http://47.128.237.174/mandalorian/luciurl3.php",
  };

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

    if (!isLocked) {
      const selectedUrl = urlOptions[selectedUrlOption]; // Pastikan selectedUrlOption valid
      const url = `${selectedUrl}?urutan=${buttonId}`;
      console.log(`Membuka website dengan URL lengkap: ${url}`); // Tambahkan log untuk debugging
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
      const selectedUrl = urlOptions[selectedUrlOption];
      const url = `<span class="math-inline">\{selectedUrl\}?urutan\=</span>{currentButtonId}`;
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
      <select
        value={selectedUrlOption}
        onChange={(event) => setSelectedUrlOption(parseInt(event.target.value))}
      >
        <option value="1">SATU (luciurl.php)</option>
        <option value="2">DUA (luciurl2.php)</option>
        <option value="3">TIGA (luciurl3.php)</option>
      </select>
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
