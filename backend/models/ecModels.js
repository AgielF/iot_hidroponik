const db = require("../config/db");

const Item = {
  getAll: (callback) => {
    db.query("SELECT * FROM sensor_ec", callback);
  },
  create: (data, callback) => {
    const query = "INSERT INTO sensor_ec (ec_value, timestamp) VALUES ( ?, ?)";
    db.query(query, [data.tdsValue, new Date()], callback);
  },
  // Mengambil data terbaru berdasarkan timestamp
  getLatest: (callback) => {
    db.query("SELECT * FROM sensor_ec ORDER BY timestamp DESC LIMIT 1", callback);
  },
  // Menghitung rata-rata suhu dan kelembaban
  Ratarata: (callback) => {
    const query = `
    SELECT 
      AVG(ec_value) AS avg_ec
    FROM sensor_ec
  `;
    db.query(query, callback);
  },
};

module.exports = Item;
