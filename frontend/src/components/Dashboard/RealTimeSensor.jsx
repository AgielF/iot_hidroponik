import React, { useEffect, useState } from "react";
import { WS_URL } from "../../config/config";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabLabels = ["DHT22", "Sensor PH", "Sensor LDR", "Sensor EC"];
  return (
    <div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {tabLabels.map((tab, index) => (
              <a
                key={index}
                href="#"
                className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                  activeTab === index + 1
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(index + 1);
                }}
              >
                {tab}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const sensorData = JSON.parse(event.data);
      setData((prevData) => [...prevData, sensorData]);
    };

    return () => ws.close();
  }, []);

  const renderTable = () => {
    switch (activeTab) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Temperature and Humidity</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Temperature</th>
                  <th className="px-4 py-2 border">Humidity</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{entry.suhu} °C</td>
                    <td className="px-4 py-2 border">{entry.kelembaban} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Sensor PH</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">PH Level</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{entry.phValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Sensor LDR</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">LDR Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{entry.ldrValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Sensor EC</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">EC Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{entry.tdsValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Sensor Data</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-6">{renderTable()}</div>
    </div>
  );
};

export default Dashboard;
