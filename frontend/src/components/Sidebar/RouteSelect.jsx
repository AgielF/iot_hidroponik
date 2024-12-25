import React from "react";
import { FiDollarSign, FiHome, FiLink, FiPaperclip, FiUsers } from "react-icons/fi";

export const RouteSelect = ({ onSelectRoute }) => {
  return (
    <div className="space-y-1">
      <Route Icon={FiHome} title="Dashboard" onClick={() => onSelectRoute("Dashboard")} />
      <Route Icon={FiUsers} title="History" onClick={() => onSelectRoute("History")} />
      <Route Icon={FiPaperclip} title="Rata-rata sensor" onClick={() => onSelectRoute("Rata-rata sensor")} />
      <Route Icon={FiLink} title="RealTIme Sensor" onClick={() => onSelectRoute("RealTime sensor")} />
      <Route Icon={FiDollarSign} title="Controling" onClick={() => onSelectRoute("Controling")} />
    </div>
  );
};

const Route = ({ Icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] hover:bg-stone-200 bg-transparent text-stone-500"
    >
      <Icon />
      <span>{title}</span>
    </button>
  );
};
