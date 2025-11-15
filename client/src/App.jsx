import React, { useEffect, useState, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import API from "./api/axios";

export default function App() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const deleteAccount = async () => {
    try {
      await API.delete("/auth/delete-account");
      localStorage.clear();
      window.location.href = "/register";
    } catch (err) {
      alert("Unable to delete account");
    }
  };

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest("#profile-btn")
      ) {
        setProfileOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest("#mobile-menu-btn")
      ) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1424] text-white">

      <header className="w-full px-6 py-4 border-b border-gray-800 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold tracking-wide">
          Finance <span className="text-purple-400">AI</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-purple-400">Dashboard</Link>
          <Link to="/add" className="hover:text-purple-400">Add Expense</Link>
          <Link to="/savings" className="hover:text-purple-400">Savings</Link>
          <Link to="/notes" className="hover:text-purple-400">Notes</Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                id="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-[#1a2238] px-3 py-2 rounded-lg hover:bg-[#222c45]"
              >
                <User size={18} />
                <span>{user.name}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a2238] rounded-lg shadow-lg p-2 z-50">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#222c45] rounded-lg"
                  >
                    <LogOut size={18} /> Logout
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#402020] rounded-lg text-red-400"
                  >
                    ❌ Delete Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </nav>

        <button
          id="mobile-menu-btn"
          className="md:hidden p-2 hover:bg-[#1a2238] rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {mobileOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-[#10182c] border-b border-gray-700 p-4 space-y-4">
          <Link to="/" className="block hover:text-purple-400">Dashboard</Link>
          <Link to="/add" className="block hover:text-purple-400">Add Expense</Link>
          <Link to="/savings" className="block hover:text-purple-400">Savings</Link>
          <Link to="/notes" className="block hover:text-purple-400">Notes</Link>

          {user ? (
            <>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg"
              >
                <LogOut size={18} /> Logout
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg"
              >
                ❌ Delete Account
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" className="btn w-full text-center">Login</Link>
              <Link to="/register" className="btn w-full text-center">Register</Link>
            </div>
          )}
        </div>
      )}

      <main className="p-4 md:p-8">
        <Outlet />
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161e32] p-6 rounded-xl max-w-sm w-full border border-gray-700 shadow-xl">
            <h3 className="text-xl font-semibold text-red-300 mb-3">Logout?</h3>
            <p className="text-gray-300 mb-5">Are you sure you want to logout?</p>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-700"
                onClick={confirmLogout}
              >
                Logout
              </button>

              <button
                className="flex-1 bg-gray-600 py-2 rounded-lg hover:bg-gray-700"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161e32] p-6 rounded-xl max-w-sm w-full border border-gray-700 shadow-xl">
            <h3 className="text-xl font-semibold text-red-400 mb-3">Delete Account?</h3>

            <p className="text-gray-300 mb-5">
              This action is permanent. All your data (expenses, savings, notes) will be deleted.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-700"
                onClick={deleteAccount}
              >
                Delete
              </button>

              <button
                className="flex-1 bg-gray-600 py-2 rounded-lg hover:bg-gray-700"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
