import { AlertTriangle, ShieldAlert, CheckCircle } from "lucide-react";
import colors from "../styles/colors";
const statusConfig = {
  CLEAN: {
    bg: colors.status.clean,
    text: colors.status.cleanText,
    icon: CheckCircle,
    label: "CLEAN",
    border: colors.status.cleanBorder,
  },
  REVIEW: {
    bg: colors.status.review,
    text: colors.status.reviewText,
    icon: AlertTriangle,
    label: "REVIEW",
    border: colors.status.reviewBorder,
  },
  FLAGGED: {
    bg: colors.status.flagged,
    text: colors.status.flaggedText,
    icon: ShieldAlert,
    label: "FLAGGED",
    border: colors.status.flaggedBorder,
  },
};

export default function StatusBadge({ status, count = 0 }) {
  const config = statusConfig[status];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className="flex flex-row gap-1 md:gap-1.5 items-center rounded-2xl px-2 py-1 whitespace-nowrap w-fit"
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon size={12} className="md:w-[14px] md:h-[14px]" color={config.text} />
      <p className="text-xs" style={{ color: config.text }}>
        {config.label}
      </p>

      <p className="text-xs" style={{ color: config.text }}>
        ({count})
      </p>
    </div>
  );
}
