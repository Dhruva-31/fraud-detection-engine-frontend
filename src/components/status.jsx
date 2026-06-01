import { Check, AlertTriangle, ShieldAlert } from "lucide-react";
import colors from "../styles/colors";
const statusConfig = {
  CLEAN: {
    bg: colors.status.clean,
    text: colors.status.cleanText,
    icon: Check,
    label: "CLEAN",
  },
  REVIEW: {
    bg: colors.status.review,
    text: colors.status.reviewText,
    icon: AlertTriangle,
    label: "REVIEW",
  },
  FLAGGED: {
    bg: colors.status.flagged,
    text: colors.status.flaggedText,
    icon: ShieldAlert,
    label: "FLAGGED",
  },
};

export default function StatusBadge({ status, count = 0 }) {
  const config = statusConfig[status];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className="flex flex-row gap-1 items-center rounded-2xl px-2 py-1 whitespace-nowrap w-fit"
      style={{ backgroundColor: config.bg }}
    >
      <Icon size={14} color={config.text} />
      <p className="text-sm" style={{ color: config.text }}>
        {config.label} ({count})
      </p>
    </div>
  );
}
