import React, { useContext, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"; // Updated import
import { FaUsers, FaBook, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../providers/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const sidebarLinks = [
    { to: "/dashboard/users", label: "Manage Users", icon: <FaUsers className="w-6 h-6" /> },
    { to: "/dashboard/books", label: "Manage Books", icon: <FaBook className="w-6 h-6" /> },
  ];

  const handleNavClick = (section) => {
    setSelectedSection(section);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    setSelectedSection(null); // Reset section on logout
    setIsSidebarOpen(false);
    navigate("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out fixed h-full z-20`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/">
            <h2 className="text-xl font-bold text-amber-600">GyanGriho Admin</h2>
          </Link>
          <button
            className="md:hidden text-gray-700 hover:text-amber-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaSignOutAlt className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4">
          {sidebarLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center p-4 text-gray-700 hover:bg-amber-100 hover:text-amber-600 transition-colors ${
                  isActive ? "bg-amber-100 text-amber-600" : ""
                }`
              }
              onClick={() => handleNavClick(label)}
            >
              {icon}
              <span className="ml-3 text-lg">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden p-4 bg-white shadow fixed w-full z-10">
          <button
            className="text-gray-700 hover:text-amber-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <main className="p-6 mt-16 md:mt-0 w-full overflow-y-auto">
          {!selectedSection ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <h1 className="text-4xl font-bold text-amber-600 mb-4">
                Welcome, {user?.displayName || "Admin"}!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Manage your bookstore with ease. Select an option from the sidebar to get started.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/dashboard/users"
                  className="btn bg-amber-500 text-white hover:bg-amber-600 rounded-md px-6 py-3"
                  onClick={() => handleNavClick("Manage Users")}
                >
                  Manage Users
                </Link>
                <Link
                  to="/dashboard/books"
                  className="btn bg-amber-500 text-white hover:bg-amber-600 rounded-md px-6 py-3"
                  onClick={() => handleNavClick("Manage Books")}
                >
                  Manage Books
                </Link>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;