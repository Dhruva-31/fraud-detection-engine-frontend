import colors from "../styles/colors";
import { CheckCircle } from "lucide-react";
import InputField from "./inputfield";
import { useState } from "react";

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AlertCard = ({ alert, onReview, status }) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const statusConfig = {
    flagged: {
      side: colors.brand.red,
      text: colors.text.primary,
    },
    reviewed: {
      side: colors.text.secondary,
      text: colors.text.muted,
    },
  };

  const getBarColor = (score) => {
    if (score >= 60) {
      return colors.brand.red;
    }

    if (score >= 30) {
      return colors.status.reviewMuted;
    }

    return colors.status.cleanText;
  };

  const config = statusConfig[status];

  if (!config) return null;

  const barColor = getBarColor(alert.transaction.riskScore);

  if (!barColor) return null;

  const progress = Math.min(alert.transaction.riskScore, 100);

  const handleChange = (e) => {
    setReviewNotes(e.target.value);
  };

  return (
    <div
      className="flex flex-col w-full p-3 md:p-4 rounded-lg gap-4"
      style={{
        border: `1px solid ${colors.bg.border}`,
        borderLeft: `4px solid ${config.side}`,
      }}
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap justify-between gap-2 items-center">
          <p className="text-base md:text-lg" style={{ color: config.text }}>
            ₹{alert.transaction.amount}
          </p>
          <p className="text-xs" style={{ color: colors.text.secondary }}>
            {formatTime(alert.transaction.timestamp)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs" style={{ color: colors.text.secondary }}>
            at
          </span>
          <p className="text-sm break-all" style={{ color: config.text }}>
            {alert.transaction.merchant}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <p className="text-xs" style={{ color: colors.text.secondary }}>
            Risk Score
          </p>

          <p className="text-xs font-bold" style={{ color: barColor }}>
            {alert.transaction.riskScore ?? 0}/100
          </p>
        </div>

        <div
          className="w-full h-1 rounded-full"
          style={{ backgroundColor: colors.bg.input }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: barColor,
            }}
          />
        </div>
      </div>
      {status === "flagged" ? (
        <div className="flex flex-wrap gap-2">
          {alert?.transaction.triggeredRules?.map((rule, index) => (
            <div
              key={index}
              className="rounded-lg text-[10px] px-2 py-1 flex items-center h-6"
              style={{
                backgroundColor: colors.bg.input,
                color: colors.text.secondary,
              }}
            >
              {rule.trim()}
            </div>
          ))}
        </div>
      ) : null}
      {status === "flagged" ? (
        <InputField
          label="Review notes"
          name="reviewNotes"
          type="text"
          value={reviewNotes}
          placeholder="type your notes"
          onChange={handleChange}
        />
      ) : (
        alert.reviewNotes && (
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            {alert.reviewNotes}
          </p>
        )
      )}
      {status === "flagged" ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onReview(alert, "FRAUD", reviewNotes)}
            className="rounded-lg p-2 hover:opacity-50 transition-all w-full"
            style={{ border: `1px solid ${colors.status.flaggedText}` }}
          >
            <p
              className="font-bold text-sm"
              style={{ color: colors.text.primary }}
            >
              Fraud
            </p>
          </button>
          <button
            onClick={() => onReview(alert, "FALSE_POSITIVE", reviewNotes)}
            className="rounded-lg p-2 hover:opacity-50 transition-all w-full"
            style={{ border: `1px solid ${colors.status.cleanMuted}` }}
          >
            <p
              className="font-bold text-sm"
              style={{ color: colors.text.primary }}
            >
              False positive
            </p>
          </button>
        </div>
      ) : (
        <div
          className="flex flex-row gap-2 items-center justify-center rounded-lg py-1"
          style={{
            backgroundColor: colors.status.clean,
            border: `1px solid ${colors.status.cleanBorder}`,
          }}
        >
          <CheckCircle color={colors.status.cleanText} size={12} />
          <p className="text-sm" style={{ color: colors.status.cleanText }}>
            Reviewed
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
