import React, { useEffect, useState } from "react";
import colors from "../styles/colors";
import api from "../api/axios";
import SummaryCard from "../components/summaryCard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const isMobile = window.innerWidth < 768;

const WeeklyTransactionChart = ({ data }) => {
  const weeklyData = data.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    count: item.count,
  }));

  return (
    <div className="h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={weeklyData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient
              id="transactionGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#FF3B3B" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#FF3B3B" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#23304D"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: colors.text.secondary,
              fontSize: window.innerWidth < 768 ? 10 : 12,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: colors.text.secondary,
              fontSize: window.innerWidth < 768 ? 10 : 12,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: colors.bg.surface,
              border: `1px solid ${colors.bg.border}`,
              borderRadius: "12px",
              color: colors.text.primary,
            }}
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#FF3B3B"
            strokeWidth={3}
            fill="url(#transactionGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatusRatioChart = ({ summary }) => {
  const pieData = [
    {
      name: "Fraud",
      value: summary.fraud,
      color: "#EF4444",
    },
    {
      name: "False Positive",
      value: summary.falsePositives,
      color: "#F59E0B",
    },
    {
      name: "Unreviewed",
      value: summary.totalAlerts - summary.reviewedAlerts,
      color: "#10B981",
    },
  ];

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[320px]">
        <p style={{ color: colors.text.secondary }}>No alert data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] md:h-[400px] flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              stroke="none"
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.bg.surface,
                border: `1px solid ${colors.bg.border}`,
                borderRadius: "12px",
                color: colors.text.primary,
              }}
            />{" "}
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              fill={colors.text.secondary}
              fontSize={window.innerWidth < 768 ? 10 : 12}
            >
              Total
            </text>
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              fill={colors.text.primary}
              fontSize={isMobile ? 24 : 34}
              fontWeight="bold"
            >
              {" "}
              {total.toLocaleString()}{" "}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-6 py-2">
        {pieData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />

            <span className="text-xs" style={{ color: colors.text.secondary }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RuleBreakdownChart = ({ data }) => {
  const Colors = [
    colors.rules.IMPOSSIBLE_TRAVEL,
    colors.rules.ROUND_AMOUNT,
    colors.rules.NEW_CATEGORY,
    colors.rules.AMOUNT_ANOMALY,
    colors.rules.VELOCITY_BREACH,
    colors.rules.ODD_HOUR,
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[320px]">
        <p style={{ color: colors.text.secondary }}>
          No Rule breakdown data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-[350px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: isMobile ? 60 : 160,
            bottom: 20,
          }}
        >
          <XAxis
            type="number"
            tick={{
              fill: colors.text.secondary,
              fontSize: window.innerWidth < 768 ? 10 : 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            dataKey="rule"
            type="category"
            tick={{
              fill: colors.text.secondary,
              fontSize: window.innerWidth < 768 ? 10 : 12,
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.bg.surface,
              border: `1px solid ${colors.bg.border}`,
              borderRadius: "12px",
              color: colors.text.primary,
            }}
            itemStyle={{
              color: "#fff",
            }}
            labelStyle={{
              color: "#fff",
            }}
          />

          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={Colors[index % Colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Analytics = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [ruleBreakdown, setRuleBreakdown] = useState(null);
  const [weekly, setWeekly] = useState(null);

  const fetchSummary = async () => {
    setError("");
    setIsFetching(true);
    try {
      const response = await api.get("/analytics/summary");
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Summary retrievel failed");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchRuleBreakdown = async () => {
    setError("");
    setIsFetching(true);
    try {
      const response = await api.get("/analytics/rule-breakdown");
      setRuleBreakdown(response.data.breakdown);
    } catch (err) {
      setError(
        err.response?.data?.message || "Rule breakdown retrievel failed",
      );
    } finally {
      setIsFetching(false);
    }
  };

  const fetchWeelyData = async () => {
    setError("");
    setIsFetching(true);
    try {
      const response = await api.get("/analytics/weekly");
      setWeekly(response.data.weekly);
    } catch (err) {
      setError(err.response?.data?.message || "Weekly retrievel failed");
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSummary(),
        fetchRuleBreakdown(),
        fetchWeelyData(),
      ]);
    };
    loadData();
  }, []);

  if (isFetching || !summary || !ruleBreakdown || !weekly) {
    return (
      <div
        style={{ backgroundColor: colors.bg.primary }}
        className="flex flex-col gap-4 p-4 md:p-6 xl:p-10 min-h-screen"
      >
        <div
          className="flex justify-center items-center py-8"
          style={{ color: colors.text.secondary }}
        >
          Loading Summary...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: colors.bg.primary }}
      className="flex flex-col gap-8 p-4 md:p-6 xl:p-10 min-h-screen w-full overflow-x-hidden"
    >
      {error && (
        <div
          style={{
            background: colors.status.flaggedMuted,
            color: colors.status.flaggedText,
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col justify-center gap-2">
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Analytics
        </h1>
        <h1 className="text-sm" style={{ color: colors.text.muted }}>
          Transaction overview - Weekly
        </h1>
      </div>
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <SummaryCard
          title="Total Transactions"
          value={summary.totalTransactions}
          icon="trend"
          message={"in a week"}
        />
        <SummaryCard
          title="Total Alerts"
          value={summary.totalAlerts}
          icon="bell"
          message={`${
            summary.totalTransactions === 0
              ? "0.0"
              : (
                  (summary.totalAlerts / summary.totalTransactions) *
                  100
                ).toFixed(1)
          }% of total transactions`}
        />
        <SummaryCard
          title="Reviewed Alerts"
          value={summary.reviewedAlerts}
          icon="clip"
          message={`${
            summary.totalAlerts === 0
              ? "0.0"
              : ((summary.reviewedAlerts / summary.totalAlerts) * 100).toFixed(
                  1,
                )
          }% of total alerts`}
        />
        <SummaryCard
          title="Fraud"
          value={summary.fraud}
          icon="sheild"
          message={`${
            summary.totalAlerts === 0
              ? "0.0"
              : ((summary.fraud / summary.totalAlerts) * 100).toFixed(1)
          }% of total alerts`}
        />
        <SummaryCard
          title="False Positive Rate"
          value={`${summary.falsePositiveRate}%`}
          icon="alert"
          message={"Target < 2.0%"}
        />
        <SummaryCard
          title="Average Riskscore"
          value={summary.avgRiskScore}
          icon="gauge"
          message={"in a week"}
        />
      </div>
      {/* Chart Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Rule Breakdown */}
        <div
          className="p-4 md:p-6 rounded-2xl w-full"
          style={{
            background: colors.bg.surface,
            border: `1px solid ${colors.bg.border}`,
          }}
        >
          <h2
            className="text-lg md:text-xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Rule Breakdown
          </h2>

          <RuleBreakdownChart data={ruleBreakdown} />
        </div>
        {/* Transaction Status */}
        <div
          className="rounded-2xl p-4 md:p-6 w-full"
          style={{
            background: colors.bg.surface,
            border: `1px solid ${colors.bg.border}`,
          }}
        >
          <h2
            className="text-lg md:text-xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Transaction Status Ratio
          </h2>

          <StatusRatioChart summary={summary} />
        </div>
      </div>
      {/* Weekly Transaction Volume */}
      <div
        className="rounded-2xl p-4 md:p-6"
        style={{
          background: colors.bg.surface,
          border: `1px solid ${colors.bg.border}`,
        }}
      >
        <h2
          className="text-lg md:text-xl font-bold mb-6"
          style={{ color: colors.text.primary }}
        >
          Weekly Transaction Volume
        </h2>

        <WeeklyTransactionChart data={weekly} />
      </div>
    </div>
  );
};

export default Analytics;
