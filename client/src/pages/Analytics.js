import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [apps, setApps] = useState([]);

  const token = localStorage.getItem("token");

  const fetchApps = async () => {
  try {
    const res = await axios.get("https://smart-internship-tracker-backend.onrender.com/api/apps", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("API DATA:", res.data); // 👈 ADD THIS

    setApps(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchApps();
}, []); // eslint-disable-line

  // 📊 BASIC STATS
const total = apps.length;
const interviews = apps.filter(a => a.status === "Interviewing").length;
const offers = apps.filter(a => a.status === "Offer").length;
const rejected = apps.filter(a => a.status === "Rejected").length;

// 📊 PIE DATA
const pieData = [
  { name: "Applied", value: apps.filter(a => a.status === "Applied").length },
  { name: "Interview", value: interviews },
  { name: "Offer", value: offers },
  { name: "Rejected", value: rejected },
];

// 📊 BAR DATA (Applications by Date)
const dateMap = {};

apps.forEach(app => {
  if (!app.appliedDate) return;

  const date = new Date(app.appliedDate).toLocaleDateString();

  dateMap[date] = (dateMap[date] || 0) + 1;
});

const barData = Object.keys(dateMap).map(date => ({
  date,
  count: dateMap[date],
}));

const COLORS = ["#a78bfa", "#34d399", "#facc15", "#f87171"];



return (
  <div className="p-6">

    <h1 className="text-2xl font-bold mb-6">Analytics 📊</h1>

    {/* 🔥 STATS */}
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Total</p>
        <h2 className="text-xl font-bold">{total}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Interviews</p>
        <h2 className="text-xl font-bold text-green-600">{interviews}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Offers</p>
        <h2 className="text-xl font-bold text-yellow-600">{offers}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Rejected</p>
        <h2 className="text-xl font-bold text-red-600">{rejected}</h2>
      </div>
    </div>

    {/* 🔥 CHARTS */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* PIE CHART */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="mb-3 font-semibold">Status Distribution</h2>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="mb-3 font-semibold">Applications Over Time</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">{barData.map((entry, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>

  </div>
);
}
export default Analytics;