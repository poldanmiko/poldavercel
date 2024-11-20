import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("luciurl.php");
  const [isAppleEnabled, setIsAppleEnabled] = useState(false);
  const [nomor, setNomor] = useState("1");
  const [opsi, setOpsi] = useState("1");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");

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
        const urlParams = new URLSearchParams({
          urutan: buttonId,
          apel: isAppleEnabled ? "yes" : "no",
        });
        const url = `http://47.128.237.174/mandalorian/${selectedUrl}?${urlParams.toString()}`;
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
        const urlParams = new URLSearchParams({
          urutan: currentButtonId,
          apel: isAppleEnabled ? "yes" : "no",
        });
        const url = `http://47.128.237.174/mandalorian/${selectedUrl}?${urlParams.toString()}`;

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams({
        nomor,
        opsi,
        apel: email,
      });
      const url = `https://due-ibby-individual-65-cb3662a6.koyeb.app/apel.php?${urlParams.toString()}`;
      const response = await fetch(url);
      if (response.ok) {
        setNotification("Data meluncur...!");
        setTimeout(() => setNotification(""), 1000); // Hide notification after 1 second
      } else {
        setNotification("Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification("Gagal menyimpan data.");
    }
  };

  return (
    <div>
      <select onChange={(e) => setSelectedUrl(e.target.value)} value={selectedUrl} className="form-select">
        <option value="luciurl.php">luciurl.php</option>
        <option value="luciurl2.php">luciurl2.php</option>
        <option value="luciurl3.php">luciurl3.php</option>
      </select>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isAppleEnabled}
          onChange={(e) => setIsAppleEnabled(e.target.checked)}
        />
        APEL?
      </label>
      {[...Array(8)].map((_, index) => (
        <button key={index} onClick={() => handleButtonClick(index + 1)}>
          Tombol {index + 1}
        </button>
      ))}
      <div className="queue-container">
        <h3>Antrian:</h3>
        <table className="queue-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID Tombol</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((buttonId, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{buttonId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleFormSubmit} className="form">
        <select onChange={(e) => setNomor(e.target.value)} value={nomor} className="form-select">
          <option value="1">Pasukan 1</option>
          <option value="2">Pasukan 2</option>
          <option value="3">Pasukan 3</option>
        </select>
        <select onChange={(e) => setOpsi(e.target.value)} value={opsi} className="form-select">
          {[...Array(8)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tambah Email?"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="form-button">Gas</button>
      </form>
      {notification && <p className="notification">{notification}</p>}
    </div>
  );
}

export default App;
