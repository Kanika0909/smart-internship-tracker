import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 px-6">

      {/* Main Card */}
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl p-10 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* LEFT CONTENT */}
        <div className="max-w-xl">

          {/* Badge */}
          <span className="inline-block mb-4 px-4 py-1 text-sm bg-purple-200 text-purple-700 rounded-full">
            🚀 Smart Internship Tracking
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-800">
            Smarter{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              Internship Tracking
            </span>
            , Powered by AI
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Track your job applications, organize your progress, and use AI to match
            your resume with job descriptions — all in one powerful dashboard.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden md:block relative">

          {/* Decorative glass shapes */}
          <div className="w-64 h-64 bg-gradient-to-tr from-purple-400 to-blue-400 rounded-3xl opacity-30 blur-2xl absolute -top-10 -left-10"></div>

          <div className="w-56 h-56 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-3xl opacity-40 blur-2xl absolute top-10 left-10"></div>

          {/* Glass Card Stack Effect */}
          <div className="relative">
            <div className="w-48 h-64 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg rotate-6"></div>
            <div className="w-48 h-64 bg-white/40 backdrop-blur-md rounded-2xl shadow-lg -rotate-6 absolute top-6 left-6"></div>
            <div className="w-48 h-64 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg absolute top-12 left-12 flex items-center justify-center text-sm text-gray-700 font-medium">
              InternTrack AI
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}