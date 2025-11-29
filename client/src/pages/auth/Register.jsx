import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/user/userSlice";
import { Navigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.user);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            className="w-full p-3 border rounded-lg"
          />
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
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
