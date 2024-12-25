const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const appWs = require("express-ws")(app);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming Request -> ${req.method} ${req.url}`);
  console.log(`[DEBUG] Body:`, req.body);
  next();
});

// Simpan klien WebSocket yang terhubung
const connectedClients = [];

wss.on("connection", (ws) => {
  console.log("[DEBUG] WebSocket client connected");
  connectedClients.push(ws);

  // Kirim pesan ke semua klien WebSocket
  ws.on("message", (message) => {
    console.log(`[DEBUG] Message from WebSocket client: ${message}`);

    try {
      const parsedMessage = JSON.parse(message); // Parse JSON dari pesan
      broadcastToClients(parsedMessage); // Broadcast data ke klien lain
    } catch (error) {
      console.error("[ERROR] Failed to parse WebSocket message:", error.message);
    }
  });

  // Hapus klien yang terputus
  ws.on("close", () => {
    console.log("[DEBUG] WebSocket client disconnected");
    const index = connectedClients.indexOf(ws);
    if (index > -1) connectedClients.splice(index, 1);
  });

  ws.on("error", (error) => {
    console.error(`[ERROR] WebSocket error: ${error.message}`);
  });
});

// Fungsi untuk mengirim data ke semua klien WebSocket
const broadcastToClients = (data) => {
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data)); // Kirim data ke klien
    }
  });
  console.log("[DEBUG] Broadcast data to all WebSocket clients:", data);
};

const sendDataToClients = (data) => {
  console.log("[DEBUG] Sending data to WebSocket clients:", data); // Pastikan data yang dikirim benar
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data)); // Kirim data dalam format JSON
    }
  });
};
// Import controller dan hubungkan dengan WebSocket untuk mengirim data secara real-time
const sensorDHT22Controller = require("./controllers/dht22Controllers");
const sensorLDRController = require("./controllers/ldrControllers");
const sensorECController = require("./controllers/ecControllers");
const sensorPHController = require("./controllers/phControllers");

sensorLDRController.setupWebSocket(sendDataToClients);
sensorDHT22Controller.setupWebSocket(sendDataToClients); // Pastikan method `setupWebSocket` ada di controller
sensorECController.setupWebSocket(sendDataToClients);
sensorPHController.setupWebSocket(sendDataToClients);

// Baca seluruh file di folder 'routes' dan tambahkan sebagai route
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use("/api", route);
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
