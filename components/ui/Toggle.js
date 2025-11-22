"use client";

export default function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`h-6 w-11 flex items-center rounded-full px-0.5 transition-all duration-200
        ${value ? "bg-indigo-500 justify-end" : "bg-slate-600/70 justify-start"}`}
    >
      <div
        className="h-4 w-4 rounded-full bg-white shadow transition-all duration-200"
      />
    </button>
  );
}
