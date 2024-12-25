import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import { getData } from "../../services/apiService";

const ActivityGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData("sensor-dht22"); // Pastikan endpoint sesuai
        // Transformasi data dari API menjadi format untuk grafik
        const transformedData = result.map((item) => ({
          name: new Date(item.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), // Format tanggal saja
          Temperature: item.temp, // Ganti "temperature" dengan field yang sesuai dari API
          Humidity: item.humid, // Ganti "humidity" dengan field yang sesuai dari API
        }));

        // Ambil 10 data terakhir
        const latestData = transformedData.slice(-10);
        setChartData(latestData);
      } catch (error) {
        console.error("Error loading sensor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="col-span-8 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiUser /> Sensor Data
        </h3>
      </div>
      <div className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={chartData}
            margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
          >
            <CartesianGrid stroke="#e4e4e7" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              padding={{ right: 4 }}
            />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              wrapperClassName="text-sm rounded"
              labelClassName="text-xs text-stone-500"
            />
            <Line type="monotone" dataKey="Temperature" stroke="#ff4500" />
            <Line type="monotone" dataKey="Humidity" stroke="#1e90ff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityGraph;
