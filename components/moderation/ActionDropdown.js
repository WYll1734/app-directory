"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

const actions = [
  { id: "disabled", label: "Disabled", color: "text-slate-300", icon: "🚫" },
  { id: "delete", label: "Delete message", color: "text-blue-300", icon: "🗑️" },
  { id: "warn", label: "Warn member", color: "text-yellow-300", icon: "⚠️" },

  { id: "timeout_30s", label: "Timeout (30s)", color: "text-orange-300", icon: "⏱️" },
  { id: "timeout_5m", label: "Timeout (5m)", color: "text-orange-300", icon: "⏱️" },
  { id: "timeout_10m", label: "Timeout (10m)", color: "text-orange-300", icon: "⏱️" },
  { id: "timeout_1h", label: "Timeout (1h)", color: "text-orange-300", icon: "⏱️" },

  { id: "kick", label: "Kick member", color: "text-rose-300", icon: "👢" },
  { id: "ban", label: "Ban member", color: "text-red-300", icon: "🔨" },

  { id: "delete_warn", label: "Delete + Warn", color: "text-blue-300", icon: "🗑️" },
  { id: "delete_timeout", label: "Delete + Timeout", color: "text-blue-300", icon: "🗑️" },
];

export default function ActionDropdown({ value, onChange }) {
  const selected = actions.find((a) => a.id === value);

  return (
    <div className="w-44">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          {/* BUTTON */}
          <Listbox.Button
            className="relative w-full cursor-pointer rounded-xl bg-slate-900 border border-slate-700 py-2 pl-3 pr-10 text-left 
                       text-xs text-slate-200 hover:bg-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <span>{selected.icon}</span>
              <span className={`${selected.color}`}>{selected.label}</span>
            </span>

            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown size={14} className="text-slate-400" />
            </span>
          </Listbox.Button>

          {/* DROPDOWN MENU */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options
              className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-slate-900 border border-slate-700 
                         shadow-lg focus:outline-none z-20"
            >
              {actions.map((action) => (
                <Listbox.Option
                  key={action.id}
                  value={action.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-10 text-xs flex items-center gap-2
                     ${active ? "bg-slate-800" : "text-slate-300"}`
                  }
                >
                  {({ selected }) => (
                    <>
                      {/* ICON */}
                      <span>{action.icon}</span>

                      {/* LABEL */}
                      <span className={`${action.color} block truncate`}>
                        {action.label}
                      </span>

                      {/* CHECKMARK */}
                      {selected ? (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-300">
                          <Check size={14} />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
