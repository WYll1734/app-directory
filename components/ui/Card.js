export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-black/30 " +
        className
      }
    >
      {children}
    </div>
  );
}
