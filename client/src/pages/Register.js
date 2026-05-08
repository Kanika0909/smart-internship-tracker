import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(
      "https://smart-internship-tracker-backend.onrender.com/api/auth/register",
      form
    );

    alert("Registered Successfully");
    navigate("/login");

  } catch (err) {
    console.log(err.response?.data || err.message);

    alert(
      err.response?.data?.msg ||
      err.response?.data?.message ||
      "Registration failed"
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#bfdbfe,#e0e7ff_35%,#f8fafc_70%)] px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white/80 shadow-2xl backdrop-blur-xl grid md:grid-cols-2">

        {/* LEFT SIDE (unchanged) */}
        <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 text-white">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_80%_30%,white,transparent_20%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              🚀 Internship Tracker
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight">
              Track applications, goals, and progress beautifully.
            </h1>

            <p className="mt-4 text-blue-100">
              Build your career journey one opportunity at a time.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
            alt="Students collaborating"
            className="relative z-10 mt-8 h-64 w-full rounded-2xl object-cover shadow-xl ring-1 ring-white/30"
          />
        </div>

        {/* FORM */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full input"
            />

            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full input"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full input"
            />

            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
              Register
            </button>
          </form>

          {/* ✅ FIXED LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?
            <span
              className="ml-1 cursor-pointer font-semibold text-blue-600"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;