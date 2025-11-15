import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Registered successfully! Redirecting...");
      setError("");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Register failed");
      setSuccess("");
    }
  };

  return (
    <div className="card max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      {error && (
        <div className="bg-red-500/20 text-red-300 border border-red-500 rounded-lg p-3 text-sm mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 text-green-300 border border-green-500 rounded-lg p-3 text-sm mb-4">
          {success}
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-3">

        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />

        <div className="relative">
          <input
            className="input pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type={showPass ? "text" : "password"}
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            className="input pr-10"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
            type={showConfirm ? "text" : "password"}
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="btn mt-2" type="submit">
          Create account
        </button>
      </form>
    </div>
  );
}
