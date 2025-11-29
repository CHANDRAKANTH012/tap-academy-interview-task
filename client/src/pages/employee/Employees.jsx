// src/pages/employee/Employees.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../api/api";

const SEEDED_USERS = [
  { id: "1001", name: "Sarah Johnson", email: "sarah.johnson@company.com", dept: "Engineering", position: "Senior Developer", status: "Active" },
  { id: "1002", name: "Mike Chen", email: "mike.chen@company.com", dept: "Product", position: "Product Manager", status: "Active" },
  { id: "1003", name: "Lisa Brown", email: "lisa.brown@company.com", dept: "Design", position: "UX Designer", status: "On Leave" },
  { id: "1004", name: "David Wilson", email: "david.wilson@company.com", dept: "Sales", position: "Sales Executive", status: "Active" }
];

export default function Employees() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const q = (searchParams.get("search") || "").trim().toLowerCase();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/users");
        if (Array.isArray(res.data)) setUsers(res.data);
        else if (res.data?.users) setUsers(res.data.users);
        else setUsers(SEEDED_USERS);
      } catch (e) {
        setUsers(SEEDED_USERS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!q) return setFiltered(users);

    const f = users.filter((u) => {
      const name = u.name?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";
      const id = (u.id || "").toString().toLowerCase();
      return name.includes(q) || email.includes(q) || id.includes(q);
    });
    setFiltered(f);
  }, [users, q]);

  return (
    <div className="container-max py-6">
      <h1 className="text-2xl font-semibold">Employee Management</h1>
      <p className="kicker">Manage your team members and their information</p>

      <div className="card mt-6">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <table className="w-full mt-3">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="py-3">Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(filtered.length ? filtered : users).map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-4">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td>{u.dept || "-"}</td>
                  <td>{u.position || "-"}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        u.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
