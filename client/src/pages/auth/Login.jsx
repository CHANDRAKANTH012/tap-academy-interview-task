import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/user/userSlice";
import { Navigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.user);
  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in to AttendanceHub</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
          />
          <input
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-black text-white"
          >
            {loading ? "Signing..." : "Sign in"}
          </button>
        </form>

        {/* Credentials Box */}
        <div className="mt-6 text-sm bg-gray-100 p-3 rounded-lg">
          <div className="font-medium mb-1">Test Credentials:</div>
          <div className="text-gray-700">
            <div>Employee → <b>emp1@example.com</b> / <b>password123</b></div>
            <div>Manager → <b>manager@example.com</b> / <b>password123</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
