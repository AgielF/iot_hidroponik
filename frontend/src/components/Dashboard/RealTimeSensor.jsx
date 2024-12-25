import React, { useEffect, useState } from "react";
import {WS_URL} from '../../config/config'

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {["Tab 1", "Tab 2"].map((tab, index) => (
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Sensor Data</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-6">
        {activeTab === 1 && (
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
                    <td className="px-4 py-2 border">{entry.temperature} °C</td>
                    <td className="px-4 py-2 border">{entry.humidity} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Additional Data</h2>
            <p className="text-gray-600">This is where additional sensor data or information will go.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
