import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout(){
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Topbar />
        <div className="max-w-[var(--page-max)] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
