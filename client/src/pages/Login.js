import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ FIX: useEffect INSIDE component
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token && window.location.pathname === "/login") {
    navigate("/dashboard");
  }
}, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://https://smart-internship-tracker-backend.onrender.com/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-200 px-4">
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        
        <h1 className="text-xl font-bold text-center mb-2">
          📈 InternTrack AI
        </h1>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-green-400 outline-none peer"
              placeholder=" "
            />
            <label className="absolute left-3 top-1 text-gray-500 text-sm transition-all 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-1 peer-focus:text-sm">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-green-400 outline-none peer"
              placeholder=" "
            />

            <label className="absolute left-3 top-1 text-gray-500 text-sm transition-all 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
              peer-focus:top-1 peer-focus:text-sm">
              Password
            </label>

            <div
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Button */}
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
            Log In
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-5 text-gray-500">
          New here?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Create an account
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;