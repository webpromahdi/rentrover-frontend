const statusClasses: Record<string, string> = {
  PLACED: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PAID: "bg-purple-100 text-purple-700",
  PICKED_UP: "bg-green-100 text-green-700",
  RETURNED: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-primary/20 text-red-700",
  PENDING: "bg-orange-100 text-orange-700",
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-[0.04em] ${statusClasses[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
};

export default StatusBadge;
