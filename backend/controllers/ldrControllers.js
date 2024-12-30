const Item = require("../models/ldrModels");

// Simpan referensi ke fungsi WebSocket pengiriman
let sendDataToClients;

// Fungsi untuk setup WebSocket
exports.setupWebSocket = (sendDataFunction) => {
  sendDataToClients = sendDataFunction;
};

// Endpoint untuk mendapatkan semua data
exports.getAllItems = (req, res) => {
  Item.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Endpoint untuk mendapatkan rata-rata data
exports.getRatarata = (req, res) => {
  Item.Ratarata((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Endpoint untuk membuat data baru
exports.createItem = (req, res) => {
  const { ldrValue } = req.body;

  console.log(`[DEBUG] Incoming POST data -> LDR: ${ldrValue}`);

  if (!ldrValue) {
    console.error("[ERROR] Missing LDR data!");
    return res.status(400).json({ error: "Data tidak lengkap!" });
  }

  const data = { ldrValue };

  // Simpan data ke database
  Item.create(data, (err, results) => {
    if (err) {
      console.error(`[ERROR] Database Insertion Error: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }

    console.log("[DEBUG] Data successfully inserted into database:", results);

    // Kirim data ke klien WebSocket jika tersedia
    if (sendDataToClients) {
      console.log("[DEBUG] Sending data to WebSocket clients:", data);
      sendDataToClients(data);
    } else {
      console.error("[ERROR] WebSocket function not defined!");
    }

    // Kirim response berhasil
    res.status(201).json({
      message: "Data berhasil disimpan",
      id: results.insertId,
    });
  });
};

// Optional: fungsi untuk mengirimkan data secara periodik (misalnya, jika sensor terhubung)
exports.sendSensorDataPeriodically = () => {
  setInterval(() => {
    const sensorData = {
      temperature: Math.random() * 30 + 20, // Simulasi suhu antara 20-50 derajat Celsius
      humidity: Math.random() * 100, // Simulasi kelembaban antara 0-100%
    };

    // Kirim data ke semua klien yang terhubung
    if (sendDataToClients) {
      console.log("[DEBUG] Periodically sending data to WebSocket clients:", sensorData);
      sendDataToClients(sensorData);
    }
  }, 1000); // Kirim data setiap detik
};
