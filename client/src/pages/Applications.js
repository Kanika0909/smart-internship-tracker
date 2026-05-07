import { useEffect, useState } from "react";
import axios from "axios";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("Applied");
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    role: "",
    company: "",
    status: "Applied",
    appliedDate: "",
    interviewDate: "",
  });

  const token = localStorage.getItem("token");

  // FETCH
  const fetchApps = async () => {
    const res = await axios.get("http://localhost:5000/api/apps", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setApps(res.data);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // ADD
  const handleAdd = async () => {
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

    setShowModal(false);
    setForm({ role: "", company: "" });

    // refresh apps
    fetchApps();

  } catch (err) {
    console.error(err);
  }
};

const openEditModal = (app) => {
  setEditData({
    ...app,
    appliedDate: app.appliedDate
      ? app.appliedDate.split("T")[0]
      : "",
    interviewDate: app.interviewDate
      ? app.interviewDate.split("T")[0]
      : "",
  });

  setEditModal(true);
};

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/apps/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchApps();
  };

  // FILTER LOGIC
  const filtered = apps.filter((app) => {
    return (
      (filter === "All" || app.status === filter) &&
      (app.role.toLowerCase().includes(search.toLowerCase()) ||
        app.company.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleUpdate = async () => {
  try {
    const data = {
      role: editData.role,
      company: editData.company,
      status: editData.status,

      ...(editData.appliedDate && {
        appliedDate: editData.appliedDate,
      }),

      ...(editData.interviewDate && {
        interviewDate: editData.interviewDate,
      }),
    };

    await axios.put(
      `http://localhost:5000/api/apps/${editData._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ CLOSE MODAL
    setEditModal(false);

    // ✅ REFRESH DATA (IMPORTANT)
    fetchApps();

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Applications 📂</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Application
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search..."
          className="border px-3 py-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
  <table className="w-full text-sm text-left">
    
    {/* HEADER */}
    <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
      <tr>
        <th className="px-6 py-3">Company</th>
        <th className="px-6 py-3">Role</th>
        <th className="px-6 py-3">Status</th>
        <th className="px-6 py-3">Applied</th>
        <th className="px-6 py-3">Interview</th>
        <th className="px-6 py-3 text-right">Actions</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody className="divide-y">
      {filtered.map((app) => (
        <tr
          key={app._id}
          className="hover:bg-gray-50 transition"
        >
          <td className="px-6 py-4 font-medium text-gray-800">
            {app.company}
          </td>

          <td className="px-6 py-4 text-gray-600">
            {app.role}
          </td>

          <td className="px-6 py-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium
              ${
                app.status === "Applied"
                  ? "bg-purple-100 text-purple-600"
                  : app.status === "Interviewing"
                  ? "bg-green-100 text-green-600"
                  : app.status === "Offer"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {app.status}
            </span>
          </td>

          <td className="px-6 py-4 text-gray-600">
            {app.appliedDate
              ? new Date(app.appliedDate).toLocaleDateString()
              : "-"}
          </td>

          <td className="px-6 py-4 text-gray-600">
            {app.interviewDate
              ? new Date(app.interviewDate).toLocaleDateString()
              : "-"}
          </td>

          {/* ACTIONS */}
          <td className="px-6 py-4 text-right space-x-3">
            <button
              onClick={() => openEditModal(app)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(app._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>

  </table>
</div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-lg font-bold mb-4">Add Job</h2>

            <input
              placeholder="Role"
              className="input mb-2"
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            />

            <input
              placeholder="Company"
              className="input mb-2"
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
            />

            <select
  value={form.status}
  className="input mb-2"
  onChange={(e) =>
    setForm({ ...form, status: e.target.value })
  }
>
  <option value="Applied">Applied</option>
  <option value="Interviewing">Interviewing</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
</select>

            <input
              type="date"
              className="input mb-2"
              onChange={(e) =>
                setForm({ ...form, appliedDate: e.target.value })
              }
            />

            {form.status === "Interviewing" && (
              <input
                type="date"
                className="input mb-2"
                onChange={(e) =>
                  setForm({
                    ...form,
                    interviewDate: e.target.value,
                  })
                }
              />
            )}

            <div className="flex justify-between mt-4">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
    <div className="bg-white p-6 rounded-xl w-96">

      <h2 className="text-lg font-bold mb-4">Edit Application</h2>

      <input
        value={editData.role}
        onChange={(e) =>
          setEditData({ ...editData, role: e.target.value })
        }
        className="input mb-2"
      />

      <input
        value={editData.company}
        onChange={(e) =>
          setEditData({ ...editData, company: e.target.value })
        }
        className="input mb-2"
      />

      <select
        value={editData.status}
        onChange={(e) =>
          setEditData({ ...editData, status: e.target.value })
        }
        className="input mb-2"
      >
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Applied Date */}
      {(editData.status === "Applied" ||
        editData.status === "Interviewing") && (
        <input
          type="date"
          value={editData.appliedDate || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              appliedDate: e.target.value,
            })
          }
          className="input mb-2"
        />
      )}

      {/* Interview Date */}
      {editData.status === "Interviewing" && (
        <input
          type="date"
          value={editData.interviewDate || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              interviewDate: e.target.value,
            })
          }
          className="input mb-2"
        />
      )}

      <div className="flex justify-between mt-4">
        <button onClick={() => setEditModal(false)}>
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}