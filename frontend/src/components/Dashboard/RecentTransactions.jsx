// src/components/RecentTransactions.jsx
import React, { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { FaTemperatureHigh } from "react-icons/fa6";
import { getData } from "../../services/apiService";
import Tabs from './Tabs';

export const RecentTransactions = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData("/sensor-dht22");
        setSensorData(result);
      } catch (error) {
        console.error("Error loading sensor data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FaTemperatureHigh /> Histori Data
        </h3>
        <button className="text-sm text-violet-500 hover:underline">
          See all
        </button>
      </div>
      <div>
        <Tabs arguments_1="kelembapan" arguments_2="PH" arguments_3="EC" arguments_4="Cahaya"/>
      </div>
      <table className="w-full table-auto">
        <TableHead />
        <tbody>
          {sensorData.map((row, index) => (
            <TableRow
              key={row.ID_dht22}
              cusId={row.ID_dht22}
              sku={`Suhu: ${row.temp}°C`}
              date={new Date(row.timestamp).toLocaleDateString()}
              price={`Humid: ${row.humid}%`}
              kecerahan={`Kecerahan: -`} // Nilai default jika tidak tersedia
              order={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">ID</th>
        <th className="text-start p-1.5">Suhu</th>
        <th className="text-start p-1.5">Tanggal</th>
        <th className="text-start p-1.5">Humid</th>
       
      </tr>
    </thead>
  );
};

const TableRow = ({ cusId, sku, date, price, kecerahan, order }) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">
        <a href="#" className="text-violet-600 underline flex items-center gap-1">
          {cusId} <FiArrowUpRight />
        </a>
      </td>
      <td className="p-1.5">{sku}</td>
      <td className="p-1.5">{date}</td>
      <td className="p-1.5">{price}</td>
      
    </tr>
  );
};
