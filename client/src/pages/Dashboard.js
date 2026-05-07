import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import Stats from "../components/Stats";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const columnStyles = {
  Applied: {
    header: "bg-purple-500",
    border: "border-purple-500",
  },
  Interviewing: {
    header: "bg-green-500",
    border: "border-green-500",
  },
  Offer: {
    header: "bg-yellow-500",
    border: "border-yellow-500",
  },
};

function Dashboard() {
  const [data, setData] = useState({
    Applied: [],
    Interviewing: [],
    Offer: [],
  });

  const [showModal, setShowModal] = useState(false);

  const [showAI, setShowAI] = useState(false);
  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("Applied");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [jobDesc, setJobDesc] = useState("");
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
  role: "",
  company: "",
  status: "Applied",
  appliedDate: "",
  interviewDate: "",
});

useEffect(() => {
  const socket = io("http://localhost:5000");

  socket.on("update", () => {
    fetchApps(); // or fetchJobs
  });

  return () => socket.disconnect();
}, []);


  const toggleDark = () => {
  document.documentElement.classList.toggle("dark");
  };

  const fetchApps = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/apps", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const grouped = {
      Applied: [],
      Interviewing: [],
      Offer: [],
    };

    res.data.forEach((app) => {
      grouped[app.status].push(app);
    });

    setData(grouped);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // ✅ FETCH DATA
  useEffect(() => {
  // initial fetch
  fetchApps();

  // 🔥 SOCKET CONNECTION
  const socket = io("http://localhost:5000");

  socket.on("update", () => {
    fetchApps(); // auto refresh
  });

  return () => socket.disconnect();
}, []);

const fetchJobs = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/apps",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setJobs(res.data);
  } catch (err) {
    console.error(err);
  }
};        

  // ✅ DRAG FUNCTION
  const handleDragEnd = async (result) => {
  if (!result.destination) return;

  const source = result.source.droppableId;
  const dest = result.destination.droppableId;

  if (
    source === dest &&
    result.source.index === result.destination.index
  ) return;

  // 🔒 keep previous state (for rollback)
  const prevData = { ...data };

  const sourceItems = [...data[source]];
  const destItems =
    source === dest ? sourceItems : [...data[dest]];

  const [moved] = sourceItems.splice(result.source.index, 1);

  moved.status = dest;

  destItems.splice(result.destination.index, 0, moved);

  // ✅ Optimistic UI update
  setData((prev) => ({
    ...prev,
    [source]: source === dest ? destItems : sourceItems,
    [dest]: destItems,
  }));

  try {
    await axios.put(
      `http://localhost:5000/api/apps/${moved._id}`,
      { status: dest },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // ✅ success toast
    toast.success("Status updated 🔄");

  } catch (err) {
    console.error(err);

    // ❌ rollback if API fails
    setData(prevData);

    toast.error("Update failed ❌");
  }
};

  // ✅ ADD JOB FUNCTION (MISSING BEFORE)
  const handleAddJob = async () => {
  try {
    const data = {
      role: form.role,
      company: form.company,
      status: form.status,

      ...(form.appliedDate && { appliedDate: form.appliedDate }),
      ...(form.interviewDate && { interviewDate: form.interviewDate }),
    };

    await axios.post(
      "http://localhost:5000/api/apps",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // ✅ CLOSE MODAL
    setShowModal(false);

    // ✅ RESET FORM (IMPORTANT)
    setForm({
      role: "",
      company: "",
      status: "Applied",
      appliedDate: "",
      interviewDate: "",
    });

    // ✅ REFRESH UI
    fetchJobs();

  } catch (err) {
    console.error(err);
  }
};

    const downloadICS = (title, date) => {
  const event = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([event], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reminder.ics";
  a.click();
};

const runMatch = async (jd) => {
  if (!file) {
    toast.error("Please upload resume first");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);

    const res = await axios.post(
      "http://localhost:5000/api/ai/match-file",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setResult(res.data);
    toast.success("Match complete 🎯");

  } catch (err) {
    console.error(err);
    toast.error("AI match failed ❌");
  }
};

  return (
  <div className="p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 dark:bg-gray-900 min-h-screen">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
        InternTrack AI 🚀
      </h1>

      <div className="flex gap-2">
        <button
          onClick={() => setShowAI(true)}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          AI Match
        </button>

        <button
          onClick={toggleDark}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          🌙
        </button>
      </div>
    </div>

    {/* STATS */}
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Applications Overview
      </h2>
      <Stats data={data} />
    </div>

    {/* SEARCH */}
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-64 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-purple-400 outline-none"
      />
    </div>

    {/* BOARD */}
    {loading ? (
      <p className="text-center mt-10">Loading...</p>
    ) : (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-5">

          {Object.keys(data).map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white/60 dark:bg-gray-800 backdrop-blur-md rounded-xl p-4 shadow"
                >

                  {/* COLUMN HEADER */}
                  <div className="flex justify-between mb-4">
                    <span className={`text-white px-3 py-1 rounded ${columnStyles[status].header}`}>
                      {status}
                    </span>
                    <span>{data[status].length}</span>
                  </div>

                  {/* EMPTY */}
                  {data[status].length === 0 && (
                    <p className="text-center text-gray-400 text-sm">
                      No jobs yet 🚀
                    </p>
                  )}

                  {/* JOB CARDS */}
                  {data[status]
                    .filter(
                      (job) =>
                        (job.role || "").toLowerCase().includes(search.toLowerCase()) ||
                        (job.company || "").toLowerCase().includes(search.toLowerCase())
                    )
                    .map((job, index) => (
                      <Draggable
                        key={job._id}
                        draggableId={job._id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white dark:bg-gray-800 text-black dark:text-white p-4 mb-3 rounded-xl shadow border-l-4 ${columnStyles[status].border}
                            hover:scale-[1.02] hover:shadow-xl transition duration-200`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {job.role}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {job.company}
                                </p>

                                <button
                                  onClick={() => downloadICS(job.role, new Date())}
                                  className="text-xs text-blue-500"
                                >
                                  Add Reminder
                                </button>
                              </div>

                              {/* DELETE */}
                              <button
                                onClick={async () => {
                                  try {
                                    await axios.delete(
                                      `http://localhost:5000/api/apps/${job._id}`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                                        },
                                      }
                                    );

                                    const updated = { ...data };
                                    updated[status] = updated[status].filter(
                                      (item) => item._id !== job._id
                                    );

                                    setData(updated);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                ✖
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}

                  {/* ADD JOB BUTTON */}
                  <div
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowModal(true);
                    }}
                    className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:bg-gray-100 rounded-lg"
                  >
                    + Add Job
                  </div>

                </div>
              )}
            </Droppable>
          ))}

        </div>
      </DragDropContext>
    )}

    {/* ================= ADD JOB MODAL ================= */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl w-80 shadow-xl">

          <h2 className="mb-4 font-semibold text-lg">Add Job</h2>

          <input
  placeholder="Role"
  value={form.role}
  onChange={(e) =>
    setForm({ ...form, role: e.target.value })
  }
  className="input mb-2"
/>

<input
  placeholder="Company"
  value={form.company}
  onChange={(e) =>
    setForm({ ...form, company: e.target.value })
  }
  className="input mb-2"
/>

{/* ✅ STATUS DROPDOWN */}
<select
  value={form.status}
  onChange={(e) =>
    setForm({ ...form, status: e.target.value })
  }
  className="input mb-2"
>
  <option value="Applied">Applied</option>
  <option value="Interviewing">Interviewing</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
</select>

{/* ✅ APPLIED DATE */}
{(form.status === "Applied" ||
  form.status === "Interviewing") && (
  <input
    type="date"
    value={form.appliedDate || ""}
    onChange={(e) =>
      setForm({ ...form, appliedDate: e.target.value })
    }
    className="input mb-2"
  />
)}

{/* ✅ INTERVIEW DATE */}
{form.status === "Interviewing" && (
  <input
    type="date"
    value={form.interviewDate || ""}
    onChange={(e) =>
      setForm({ ...form, interviewDate: e.target.value })
    }
    className="input mb-2"
  />
)}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowModal(false)}
              className="w-1/2 border py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleAddJob}
              className="w-1/2 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ================= AI MODAL ================= */}
    {showAI && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-xl">

          <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
            AI Resume Match 🤖
          </h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3 w-full"
          />

          <textarea
            placeholder="Paste Job Description..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />

          <button
            onClick={runMatch}
            className="bg-purple-500 text-white px-4 py-2 w-full rounded-lg hover:bg-purple-600"
          >
            Analyze
          </button>

          <button
            onClick={() => setShowAI(false)}
            className="mt-3 w-full border py-2 rounded-lg"
          >
            Close
          </button>

          {/* RESULT */}
          {result && (
            <div className="mt-4 bg-green-100 dark:bg-green-900 p-3 rounded">
              <h3 className="font-bold text-lg">
                Match Score: {result.score}%
              </h3>

              <p className="mt-2 text-green-700 dark:text-green-300">
                Strengths: {result.strengths?.join(", ")}
              </p>

              <p className="mt-2 text-red-500">
                Gaps: {result.gaps?.join(", ")}
              </p>
            </div>
          )}

        </div>
      </div>
    )}

  </div>
);
}

export default Dashboard;