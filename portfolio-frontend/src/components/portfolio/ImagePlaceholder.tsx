import { Camera } from "lucide-react";

export function ImagePlaceholder({
  aspect = "16/9",
  label = "Add photo",
  className = "",
}: {
  aspect?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: aspect,
        border: "1px dashed var(--border)",
        background: "color-mix(in oklab, var(--bg-elevated) 60%, transparent)",
      }}
      aria-label={label}
      role="img"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-text-muted">
        <Camera size={16} strokeWidth={1.5} />
        <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}
