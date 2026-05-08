import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AIMatchModal({ onClose }) {
  const [resume, setResume] = useState("");
  const [jd, setJD] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const runMatch = async (jd) => {
  if (!file) {
    toast.error("Please upload resume");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("resume", file); // ✅ MUST be "resume"
    formData.append("jobDescription", jd);

    const res = await axios.post(
      "http://https://smart-internship-tracker-backend.onrender.com/api/ai/match-file",
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
        <h2 className="font-semibold mb-3">AI Match</h2>

        <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3"
        />

        <textarea
          placeholder="Paste Job Description..."
          className="w-full border p-2 mb-3 rounded"
          rows={4}
          value={jd}
          onChange={(e) => setJD(e.target.value)}
        />

        <button
          onClick={runMatch}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-4">
            <p className="font-bold">Score: {result.score}%</p>
            <p className="text-sm mt-2">Strengths: {result.strengths.join(", ")}</p>
            <p className="text-sm">Gaps: {result.gaps.join(", ")}</p>
          </div>
        )}

        <button onClick={onClose} className="mt-3 text-gray-500">
          Close
        </button>
      </div>
    </div>
  );
}