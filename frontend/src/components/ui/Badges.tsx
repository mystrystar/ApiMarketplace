export function StatusBadge({ status }: { status: number | string }) {
  const code = Number(status);
  const tone =
    code === 200
      ? "bg-[var(--green-dim)] text-[var(--green)]"
      : code === 400 || code === 404 || code === 429
        ? "bg-[var(--amber-dim)] text-[var(--amber)]"
        : "bg-[var(--red-dim)] text-[var(--red)]";

  return <span className={`status-badge ${tone}`}>{status}</span>;
}

export function MethodBadge({ method = "POST" }: { method?: string }) {
  const isGet = method.toUpperCase() === "GET";
  return (
    <span
      className={`rounded px-2 py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.5px] ${
        isGet
          ? "bg-[var(--green-dim)] text-[var(--green)]"
          : "bg-[var(--accent-dim)] text-[#7eb8ff]"
      }`}
    >
      {method}
    </span>
  );
}
