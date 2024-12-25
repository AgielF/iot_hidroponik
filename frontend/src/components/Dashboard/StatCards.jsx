import React, { useEffect, useState } from "react";
import { getData } from "../../services/apiService";

// Komponen Tabs
function Tabs({ options, activeTab, setActiveTab }) {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="Tab" className="sr-only">Tab</label>
        <select
          id="Tab"
          className="w-full rounded-md border-gray-200"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {options.map((option, index) => (
            <option key={index} value={index + 1}>{option}</option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {options.map((option, index) => (
              <a
                key={index}
                href="#"
                className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                  activeTab === (index + 1).toString()
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab((index + 1).toString());
                }}
              >
                {option}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

// Komponen StatCards
function StatCards({ apiEndpoint }) {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData(apiEndpoint); // Menggunakan endpoint API spesifik
        setSensorData(result[0]); // API mengembalikan array, ambil elemen pertama
      } catch (error) {
        console.error("Error loading sensor data:", error);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (!sensorData) {
    return <p>Loading...</p>;
  }

  return (
    <Card
      title="DHT 22"
      value={sensorData.avg_temp.toFixed(2)}
      value1={sensorData.avg_humid.toFixed(2)}
    />
  );
}

const Card = ({ title, value, value1 }) => (
  <div className="col-span-4 p-4 rounded border border-stone-300">
    <div className="flex mb-8 items-start justify-between">
      <div>
        <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
        <p className="text-3xl font-semibold">Rata-rata Temp: {value}°C</p>
        <p className="text-3xl font-semibold">Rata-rata Humid: {value1}%</p>
      </div>
    </div>
  </div>
);

// Komponen Utama
function MainComponents() {
  const [activeTab, setActiveTab] = useState("1");
  const [activeSubTab, setActiveSubTab] = useState("1");

  const mainTabs = [
    "rata-rata sensor DHT22",
    "rata-rata sensor PH",
    "rata-rata sensor cahaya",
    "rata-rata sensor EC",
  ];

  const subTabs = ["rata-rata keseluruhan","10 menit", "20 menit", "30 menit", "60 menit"];

  const subTabEndpoints = [
    "sensor-dht22/rata-rata",
    "sensor-dht22/rata-rata/10",
    "sensor-dht22/rata-rata/20",
    "sensor-dht22/rata-rata/30",
    "sensor-dht22/rata-rata/60",
  ];

  return (
    <div className="container mx-auto p-4">
      <Tabs
        options={mainTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === "1" && (
          <div>
            <Tabs
              options={subTabs}
              activeTab={activeSubTab}
              setActiveTab={setActiveSubTab}
            />
            <div className="mt-6">
              {subTabEndpoints.map((endpoint, index) => (
                activeSubTab === (index + 1).toString() && <StatCards key={index} apiEndpoint={endpoint} />
              ))}
            </div>
          </div>
        )}
        {activeTab === "2" && <p>konten untuk Tab 1</p>}
        {activeTab === "3" && <p>Konten untuk Tab 2</p>}
        {activeTab === "4" && <p>Konten untuk Tab 3</p>}
        {activeTab === "5" && <p>Konten untuk Tab 4</p>}
      </div>
    </div>
  );
}

export default MainComponents;
