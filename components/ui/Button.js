export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium " +
        "bg-indigo-500 text-white hover:bg-indigo-400 transition shadow-md shadow-indigo-900/40 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
