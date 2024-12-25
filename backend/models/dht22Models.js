const db = require("../config/db");

const Item = {
  getAll: (callback) => {
    db.query("SELECT * FROM dht_22", callback);
  },
  create: (data, callback) => {
    const query = "INSERT INTO dht_22 (temp, humid, timestamp) VALUES (?, ?, ?)";
    db.query(query, [data.temperature, data.humidity, new Date()], callback);
  },
  // Mengambil data terbaru berdasarkan timestamp
  getLatest: (callback) => {
    db.query("SELECT * FROM dht_22 ORDER BY timestamp DESC LIMIT 1", callback);
  },
  // Menghitung rata-rata suhu dan kelembaban
  Ratarata: (callback) => {
    const query = `
    SELECT 
      AVG(temp) AS avg_temp, 
      AVG(humid) AS avg_humid 
    FROM dht_22
  `;
    db.query(query, callback);
  },
};

module.exports = Item;
