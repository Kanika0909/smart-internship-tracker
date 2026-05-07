import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 ml-0 md:ml-60">
        {children}
      </div>

    </div>
  );
}