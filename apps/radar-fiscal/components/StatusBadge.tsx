import { STATUS_LABEL, type StatusTarefa } from "@/lib/domain";

export function StatusBadge({ status }: { status: StatusTarefa }) {
  return <span className={`badge st-${status}`}>{STATUS_LABEL[status]}</span>;
}
