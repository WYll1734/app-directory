export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={
        "w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm " +
        "placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 " +
        "min-h-[120px] " +
        className
      }
      {...props}
    />
  );
}
