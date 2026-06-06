import { Bell, CheckCircle, ChevronsUp, Plus, ShieldAlert } from "lucide-react";
import InputField from "../components/inputfield";
import colors from "../styles/colors";
import { useEffect, useState } from "react";
import api from "../api/axios";
import StatusBadge from "../components/status";
import { TransactionCard } from "../components/transactionCard";
import AlertCard from "../components/alertCard";
import { useSocket } from "../context/socketContext";

const TABLE_GRID =
  "grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_180px] items-center";

const Header = ({ setIsExpanded }) => {
  return (
    <div
      className={`${TABLE_GRID} px-4 py-3`}
      style={{
        backgroundColor: colors.bg.input,
        borderTop: `1px solid ${colors.bg.border}`,
      }}
    >
      <ChevronsUp
        size={16}
        color={colors.text.secondary}
        className="cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => setIsExpanded({})}
      />

      <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
        MERCHANT
      </p>

      <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
        CATEGORY
      </p>

      <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
        AMOUNT
      </p>

      <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
        LOCATION
      </p>

      <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
        TIME
      </p>

      <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
        STATUS
      </p>
    </div>
  );
};

const SubmitCard = ({
  transactionData,
  handleChange,
  handleSubmit,
  loading,
  fraudResult,
}) => {
  return (
    <div
      className="w-full max-w-6xl flex flex-col p-4 rounded-xl gap-4"
      style={{ backgroundColor: colors.bg.surface }}
    >
      <div className="flex flex-row gap-2 items-center w-full">
        <Plus color={colors.brand.red} size={20} />
        <h2
          style={{ color: colors.text.primary }}
          className="text-xl font-bold"
        >
          Submit Transaction
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <InputField
            label="AMOUNT (₹)"
            placeholder="0.00"
            name="amount"
            type="number"
            value={transactionData.amount}
            onChange={handleChange}
          />
          <InputField
            label="MERCHANT"
            placeholder="e.g. Amazon"
            name="merchant"
            type="text"
            value={transactionData.merchant}
            onChange={handleChange}
          />
          <div>
            <label className="text-sm" style={{ color: colors.text.secondary }}>
              CATEGORY
            </label>
            <select
              name="category"
              value={transactionData.category}
              onChange={handleChange}
              className="w-full h-11 p-2 border border-[#2A2D3E] rounded-lg text-sm focus:outline-none focus:border-[#FF3B3B] focus:ring-1 focus:ring-[#FF3B3B] transition-all appearance-none"
              style={{
                backgroundColor: colors.bg.input,
                color: colors.text.primary,
              }}
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="electronics">Electronics</option>
              <option value="entertainment">Entertainment</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>
          <InputField
            label="LOCATION"
            placeholder="e.g. Chennai"
            name="location"
            type="text"
            value={transactionData.location}
            onChange={handleChange}
          />
        </div>
        <div
          className="w-full h-px"
          style={{ backgroundColor: colors.bg.border }}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium hover:opacity-70 transition-all"
          style={{
            color: colors.text.primary,
            backgroundColor: loading ? colors.brand.redHover : colors.brand.red,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Submit Transaction"}
        </button>
      </form>
      {fraudResult.riskScore ? (
        <div className="flex flex-wrap justify-center items-center gap-2">
          <span className="text-sm text-[#94A3B8]">Last Scan Result: </span>
          <StatusBadge
            status={fraudResult.status}
            count={fraudResult.riskScore}
          />
        </div>
      ) : null}
    </div>
  );
};

const TransactionPart = ({
  transactions,
  setIsExpanded,
  isFetching,
  isExpanded,
}) => {
  return (
    <div
      className="flex flex-col w-full rounded-xl max-w-6xl overflow-hidden"
      style={{
        border: `1px solid ${colors.bg.border}`,
      }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: colors.bg.surface,
        }}
      >
        <h2
          className="text-lg font-bold"
          style={{ color: colors.text.primary }}
        >
          Recent Transactions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <Header setIsExpanded={setIsExpanded} />
          {isFetching ? (
            <div
              className="flex justify-center items-center py-8"
              style={{ color: colors.text.secondary }}
            >
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div
              className="flex justify-center items-center py-4"
              style={{
                color: colors.text.secondary,
                backgroundColor: colors.bg.elevated,
              }}
            >
              No transactions found.
            </div>
          ) : (
            <div className="max-h-[430px] overflow-y-auto">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  isExpanded={isExpanded[transaction.id]}
                  setIsExpanded={setIsExpanded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AlertPart = ({
  reviewedAlerts,
  pendingAlerts,
  isFetching,
  setShowPending,
  showPending,
  reviewAlert,
}) => {
  const { fraudAlert, setFraudAlert } = useSocket();

  const Tag = ({ text }) => (
    <span
      className="
      rounded-md
      border
      border-red-500/30
      bg-black/30
      px-2
      py-1
      text-xs
      text-red-400
    "
    >
      {text}
    </span>
  );
  return (
    <div
      className="flex flex-col w-full gap-2 rounded-xl overflow-hidden relative"
      style={{
        backgroundColor: colors.bg.surface,
        border: `1px solid ${colors.bg.border}`,
      }}
    >
      {fraudAlert && (
        <div className="absolute top-0 z-50 w-full">
          <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-red-950/40 backdrop-blur-md">
            <div className="relative p-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                    <ShieldAlert className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-100">
                          LIVE ALERT
                        </span>

                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      </div>

                      <p className="mt-1 text-gray-200 text-sm">
                        High risk transaction detected (₹{fraudAlert.amount})
                      </p>
                    </div>
                    {/* Tags */}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {fraudAlert.triggeredRules.map((rule, idx) => (
                        <Tag key={`${rule}-${idx}`} text={rule} />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFraudAlert(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="flex flex-row gap-3 items-center p-4"
        style={{ borderBottom: `1px solid ${colors.bg.border}` }}
      >
        <Bell size={20} color={colors.text.primary} />
        <h1
          className="font-bold text-xl"
          style={{ color: colors.text.primary }}
        >
          Fraud Alerts
        </h1>
        {pendingAlerts.length !== 0 && (
          <div
            className="w-5 h-5 rounded-2xl flex justify-center items-center"
            style={{
              color: colors.text.primary,
              backgroundColor: colors.brand.red,
            }}
          >
            <p className="text-sm">{pendingAlerts.length}</p>
          </div>
        )}
      </div>
      <div
        className="flex flex-row justify-between"
        style={{ borderBottom: `1px solid ${colors.bg.border}` }}
      >
        <div
          onClick={() => setShowPending(true)}
          className="flex flex-row w-full justify-center items-center p-2"
          style={{
            borderBottom: showPending
              ? `2px solid ${colors.brand.red}`
              : "2px solid transparent",
          }}
        >
          <p
            className="hover:opacity-70 text-md"
            style={{
              color: colors.text.primary,
            }}
          >
            Pending
          </p>
        </div>
        <div
          onClick={() => setShowPending(false)}
          className="flex flex-row w-full justify-center items-center p-2"
          style={{
            borderBottom: !showPending
              ? `2px solid ${colors.status.cleanText}`
              : "2px solid transparent",
          }}
        >
          <p
            className="hover:opacity-70 text-md"
            style={{ color: colors.text.primary }}
          >
            Resolved
          </p>
        </div>
      </div>
      {/*Alerts */}
      {showPending ? (
        isFetching ? (
          <div
            className="min-h-[400px] md:min-h-[700px] flex justify-center items-center py-8"
            style={{ color: colors.text.secondary }}
          >
            Loading alerts...
          </div>
        ) : pendingAlerts.length === 0 ? (
          <div
            className="h-[500px] md:h-[700px] flex flex-col h-full gap-2 justify-center items-center py-4"
            style={{
              color: colors.text.secondary,
            }}
          >
            <CheckCircle size={40} color={colors.status.cleanText} />
            <p>No pending alerts.</p>
          </div>
        ) : (
          <div className="h-[500px] md:h-[700px] p-4 flex flex-col gap-4 overflow-y-auto">
            {pendingAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                status={"flagged"}
                onReview={reviewAlert}
              />
            ))}
          </div>
        )
      ) : isFetching ? (
        <div
          className="min-h-[400px] md:min-h-[700px] flex justify-center items-center py-8"
          style={{ color: colors.text.secondary }}
        >
          Loading alerts...
        </div>
      ) : reviewedAlerts.length === 0 ? (
        <div
          className="h-[500px] md:h-[700px] flex flex-col gap-2 justify-center items-center py-4"
          style={{
            color: colors.text.secondary,
          }}
        >
          <CheckCircle size={40} color={colors.status.cleanText} />
          <p>No reviewed alerts.</p>
        </div>
      ) : (
        <div className="h-[500px] md:h-[700px] flex flex-col gap-4 p-4 overflow-y-auto">
          {reviewedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} status={"reviewed"} />
          ))}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showPending, setShowPending] = useState(true);
  const [fraudResult, setFraudResult] = useState({
    riskScore: 0,
    triggeredRules: [],
    status: "CLEAN",
  });
  const [transactionData, setTransactionData] = useState({
    amount: "",
    merchant: "",
    category: "food",
    location: "",
  });

  const handleChange = (e) => {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  };

  const fetchTransactions = async () => {
    setError("");
    setIsFetching(true);
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || "Transaction retrievel failed");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAlerts = async () => {
    setError("");
    setIsFetching(true);
    try {
      const response = await api.get("/fraud/alerts");
      setAlerts(response.data.alerts);
    } catch (err) {
      setError(err.response?.data?.message || "Alerts retrievel failed");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const payload = {
        ...transactionData,
        amount: Number(transactionData.amount),
      };
      const response = await api.post("/transactions", payload);
      const newFraudResult = response.data.fraudResult;
      if (newFraudResult) {
        setFraudResult(newFraudResult);
      }
      setTransactionData({
        amount: "",
        merchant: "",
        category: "food",
        location: "",
      });
      await fetchTransactions();
      await fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewAlert = async (alert, outcome, reviewNotes) => {
    setError("");
    try {
      const response = await api.put(`/fraud/alerts/${alert.id}`, {
        outcome,
        reviewNotes,
      });
      setAlerts((prev) =>
        prev.map((a) => (a.id === alert.id ? response.data.alert : a)),
      );
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === alert.transaction.id ? { ...t, status: "CLEAN" } : t,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Review failed");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTransactions(), fetchAlerts()]);
    };
    loadData();
  }, []);

  const pendingAlerts = alerts.filter((alert) => !alert.reviewed);

  const reviewedAlerts = alerts.filter((alert) => alert.reviewed);

  return (
    <div
      style={{ backgroundColor: colors.bg.primary }}
      className="flex flex-col gap-4 p-4 md:p-6 xl:p-8 min-h-screen"
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
      <div className="flex flex-col xl:flex-row items-start w-full gap-6 xl:gap-10">
        <div className="flex flex-col w-full gap-4">
          {/*Save Transaction */}
          <SubmitCard
            transactionData={transactionData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={isSubmitting}
            error={error}
            fraudResult={fraudResult}
          />
          {/* Recent Transaction */}
          <TransactionPart
            transactions={transactions}
            isFetching={isFetching}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </div>
        {/* Alert */}
        <div className="w-full xl:w-[700px] shrink-0">
          <AlertPart
            reviewedAlerts={reviewedAlerts}
            pendingAlerts={pendingAlerts}
            showPending={showPending}
            setShowPending={setShowPending}
            reviewAlert={reviewAlert}
            isFetching={isFetching}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
