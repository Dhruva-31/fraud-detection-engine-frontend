import { ChevronDown, ChevronRight } from "lucide-react";
import colors from "../styles/colors";
import StatusBadge from "./status";

const TABLE_GRID =
  "grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_180px] items-center";

  const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

export const TransactionCard = ({ transaction, isExpanded, setIsExpanded }) => {

  const toggleExpand = () => {
    setIsExpanded((prev) => ({
      ...prev,
      [transaction.id]: !prev[transaction.id],
    }));
  };
  

  return (
    <div className="w-full flex flex-col">
      <div
        className={`${TABLE_GRID} px-4 py-3`}
        style={{
          backgroundColor: colors.bg.surface,
          borderTop: `1px solid ${colors.bg.border}`,
        }}
      >
        {isExpanded ? (
          <ChevronDown
            size={16}
            color={colors.text.secondary}
            onClick={toggleExpand}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          />
        ) : (
          <ChevronRight
            size={16}
            color={colors.text.secondary}
            onClick={toggleExpand}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          />
        )}

        <p className="text-sm truncate" style={{ color: colors.text.primary }}>
          {transaction.merchant}
        </p>

        <p
          className="text-sm capitalize"
          style={{ color: colors.text.secondary }}
        >
          {transaction.category}
        </p>

        <p className="text-sm" style={{ color: colors.text.primary }}>
          ₹{transaction.amount}
        </p>

        <p
          className="text-sm truncate"
          style={{ color: colors.text.secondary }}
        >
          {transaction.location}
        </p>

        <p className="text-sm" style={{ color: colors.text.primary }}>
          {formatTime(transaction.timestamp)}
        </p>

        <div className="flex justify-start">
          <StatusBadge
            status={transaction.status}
            count={transaction.fraudAlert?.riskScore ?? 0}
          />
        </div>
      </div>

      {isExpanded && (
        <div
          className="px-5 py-2"
          style={{
            backgroundColor: colors.bg.input,
            borderTop: `1px solid ${colors.bg.border}`,
          }}
        >
          <h1
            className="font-medium text-sm mb-1"
            style={{ color: colors.text.secondary }}
          >
            TRIGGERED RULES
          </h1>

          <div className="flex flex-wrap gap-2">
            {transaction.fraudAlert?.triggeredRules ? (
              transaction.fraudAlert.triggeredRules
                .split(",")
                .map((rule, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{
                      backgroundColor: colors.status.flaggedMuted,
                      color: colors.status.flaggedText,
                    }}
                  >
                    {rule.trim()}
                  </div>
                ))
            ) : (
              <p className="text-sm" style={{ color: colors.status.cleanText }}>
                None. Transaction is considered safe.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
