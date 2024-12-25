const db = require("../config/db");

const Item = {
  getAll: (callback) => {
    db.query("SELECT * FROM sensor_ldr", callback);
  },
  create: (data, callback) => {
    const query = "INSERT INTO sensor_ldr (ldr_value, timestamp) VALUES ( ?, ?)";
    db.query(query, [data.ldr_value, new Date()], callback);
  },
  // Mengambil data terbaru berdasarkan timestamp
  getLatest: (callback) => {
    db.query("SELECT * FROM sensor_ldr ORDER BY timestamp DESC LIMIT 1", callback);
  },
  // Menghitung rata-rata suhu dan kelembaban
  Ratarata: (callback) => {
    const query = `
    SELECT 
      AVG(ldr_value) AS avg_ldr_value
    FROM sensor_ldr
  `;
    db.query(query, callback);
  },
};

module.exports = Item;
