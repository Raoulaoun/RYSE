import type { Pill as PillColors } from "@/lib/admin/status";

export function Pill({ label, pill, small }: { label: string; pill: PillColors; small?: boolean }) {
  return (
    <span className={"pill" + (small ? " s" : "")} style={{ background: pill.bg, color: pill.fg }}>
      {label}
    </span>
  );
}
