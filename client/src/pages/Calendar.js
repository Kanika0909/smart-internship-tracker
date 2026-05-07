import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function CalendarPage() {
  const [apps, setApps] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);

  const token = localStorage.getItem("token");

  // 🔥 FETCH DATA
  const fetchApps = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/apps", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  fetchApps();
  }, []);

  useEffect(() => {
  const socket = io("http://localhost:5000");

  socket.on("update", () => {
    fetchApps(); // refresh calendar when data changes
  });

  return () => socket.disconnect();
}, []);

  // 🔥 GET DAYS OF MONTH
const getDaysInMonth = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  return days;
};

const getEventsForDay = (day) => {
  return apps.filter((app) => {
    let eventDate = null;

    if (app.status === "Applied") {
      eventDate = app.appliedDate;
    }

    if (app.status === "Interviewing") {
      eventDate = app.interviewDate;
    }

    // Optional: show offer also using appliedDate
    if (app.status === "Offer") {
      eventDate = app.appliedDate;
    }

    if (!eventDate) return false;

    const d = new Date(eventDate);

    return (
      d.getDate() === day.getDate() &&
      d.getMonth() === day.getMonth() &&
      d.getFullYear() === day.getFullYear()
    );
  });
};

const handleDayClick = (day) => {
  const events = getEventsForDay(day);
  setSelectedDay(day);
  setDayEvents(events);
};

const days = getDaysInMonth();

  return (
  <div className="p-6">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        {currentDate.toLocaleString("default", { month: "long" })}{" "}
        {currentDate.getFullYear()}
      </h1>

      <div className="space-x-2">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setMonth(currentDate.getMonth() - 1))
            )
          }
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setMonth(currentDate.getMonth() + 1))
            )
          }
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>

    {/* GRID */}
    <div className="grid grid-cols-7 gap-4">

      {days.map((day, index) => {
        const events = getEventsForDay(day);

        return (
          <div onClick={() => handleDayClick(day)}className="bg-white rounded-xl p-3 min-h-[120px] shadow cursor-pointer hover:shadow-md transition">
          <div className="text-sm font-semibold mb-1">
            {day.getDate()}
          </div>

            {/* EVENTS */}
            {events.map((event) => (
              <div
                key={event._id}
                className={`text-xs rounded p-1 mb-1 border-l-4
                ${
                  event.status === "Applied"
                    ? "border-purple-500 bg-purple-50"
                    : event.status === "Interviewing"
                    ? "border-green-500 bg-green-50"
                    : event.status === "Offer"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="font-medium">
                  {event.company}
                </div>
                <div className="text-gray-500">
                  {event.role}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
    {selectedDay && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    
    <div className="bg-white rounded-xl w-96 p-6 shadow-lg">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          {selectedDay.toDateString()}
        </h2>

        <button
          onClick={() => setSelectedDay(null)}
          className="text-gray-500"
        >
          ✕
        </button>
      </div>

      {/* EVENTS */}
      {dayEvents.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No events for this day
        </p>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((event) => (
            <div
              key={event._id}
              className={`p-3 rounded-lg border-l-4
              ${
                event.status === "Applied"
                  ? "border-purple-500 bg-purple-50"
                  : event.status === "Interviewing"
                  ? "border-green-500 bg-green-50"
                  : event.status === "Offer"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <div className="font-semibold">
                {event.role}
              </div>

              <div className="text-sm text-gray-600">
                {event.company}
              </div>

              <div className="text-xs mt-1">
                {event.status}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  </div>
)}
  </div>
);
}

export default CalendarPage;