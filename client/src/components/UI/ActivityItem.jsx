import React from "react";

export default function ActivityItem({ avatar, name, action, time, color }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-transparent hover:shadow-sm">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">{avatar || name?.slice(0,1)}</div>
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">{action}</div>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  );
}
