import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Folder,
  Calendar,
  Menu,
  X,
  BarChart3
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/applications", icon: Folder, label: "Applications" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:fixed z-50 top-0 left-0 h-screen
          w-60
          bg-white border-r shadow-sm
          flex flex-col
          py-6 px-2
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button */}
        <button
          className="md:hidden absolute top-4 right-4"
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mb-6">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
            InternTrack AI
          </span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition w-full
                ${
                  isActive
                    ? "bg-purple-500 text-white shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`
              }
            >
              <Icon size={22} />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
        <button
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }}
  className="mt-auto mx-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
>
  Logout
</button>
      </div>
    </>
  );
}