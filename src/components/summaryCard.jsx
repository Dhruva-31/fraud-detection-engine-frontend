import {
  AlertTriangle,
  Bell,
  ClipboardCheck,
  Gauge,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import colors from "../styles/colors";

const statusConfig = {
  bell: {
    icon: Bell,
    color: colors.status.flaggedText,
  },
  shield: {
    icon: ShieldAlert,
    color: colors.status.flaggedText,
  },
  trend: {
    icon: TrendingUp,
    color: colors.status.cleanMuted,
  },
  clip: {
    icon: ClipboardCheck,
    color: colors.status.reviewMuted,
  },
  alert: {
    icon: AlertTriangle,
    color: colors.status.reviewMuted,
  },
  gauge: {
    icon: Gauge,
    color: colors.status.cleanMuted,
  },
};

const SummaryCard = ({ title, value, icon, message }) => {
  const config = statusConfig[icon];

  if (!config) return null;

  return (
    <div
      className="flex flex-col w-full justify-center gap-6 p-4 rounded-xl"
      style={{
        backgroundColor: colors.bg.surface,
        border: `1px solid ${colors.bg.border}`,
      }}
    >
      <div className="w-full flex flex-row justify-between">
        <h1
          className="text-sm font-bold"
          style={{ color: colors.text.secondary }}
        >
          {title}
        </h1>

        <div
          className="rounded-lg px-2 py-1"
          style={{ backgroundColor: colors.bg.border }}
        >
          <config.icon size={16} color={config.color} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color: config.color }}>
          {typeof value === "number" ? value.toLocaleString() : String(value ?? "-")}
        </p>
        <p className="text-sm" style={{ color: colors.text.secondary }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
