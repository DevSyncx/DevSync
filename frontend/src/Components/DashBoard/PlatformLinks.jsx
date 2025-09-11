export default function PlatformLinks({ platforms }) {
  return (
  <div className="grid grid-cols-2 gap-3">
      {platforms && platforms.length > 0 ? (
        platforms.map((p, i) => (
          <a
            key={i}
            href={p.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[var(--card)] rounded-lg p-3 shadow-sm hover:shadow-md transition"
          >
            {/* Icon fallback */}
            <img
              src={p.icon || "https://cdn-icons-png.flaticon.com/512/25/25231.png"}
              alt={p.name || "Platform"}
              className="w-4 h-4"
            />
            <div className="flex flex-col text-sm">
              <span className="text-xs text-[var(--primary)]">{p.name || "Unknown Platform"}</span>
              <span className="text-sm text-[var(--muted-foreground)]">{p.lastActive || "0 days active"}</span>
            </div>
          </a>
        ))
      ) : (
        <div className="flex items-center justify-center col-span-2 bg-[var(--card)] rounded-lg p-3 shadow-sm">
          <span className="text-sm text-[var(--muted-foreground)] italic">
            No platforms linked yet
          </span>
        </div>
      )}
    </div>
  );
}
