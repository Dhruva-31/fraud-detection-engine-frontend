import { ChevronsUp, Plus } from "lucide-react";
import InputField from "../components/inputfield";
import colors from "../styles/colors";
import { useEffect, useState } from "react";
import api from "../api/axios";
import StatusBadge from "../components/status";
import { TransactionCard } from "../components/transactionCard";

const SubmitCard = ({
  transactionData,
  handleChange,
  handleSubmit,
  loading,
  error,
  fraudResult,
}) => {
  return (
    <div
      className="w-full max-w-4xl flex flex-col p-4 rounded-xl gap-4"
      style={{ backgroundColor: colors.bg.surface }}
    >
      <div className="flex flex-row gap-2 items-center w-full">
        <Plus color={colors.brand.red} size="20" />
        <h2 style={{ color: colors.text.primary }} className="text-xl">
          Submit Transaction
        </h2>
      </div>

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
      {fraudResult.riskScore !== 0 ? (
        <div className="flex justify-center items-center gap-2 h-8">
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

const Home = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState({});
  const [transactions, setTransactions] = useState([]);
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
      setError(err.response?.data?.message || "Transaction failed");
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
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTransactions();
    };
    loadData();
  }, []);

  return (
    <div
      style={{ backgroundColor: colors.bg.primary }}
      className="flex items-center justify-center p-6 min-h-screen"
    >
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full gap-4">
          <SubmitCard
            transactionData={transactionData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={isSubmitting}
            error={error}
            fraudResult={fraudResult}
          />
          <div
            className="flex flex-col w-full rounded-xl overflow-hidden"
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
              <h2 className="text-lg" style={{ color: colors.text.primary }}>
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
                    className="flex justify-center items-center py-8"
                    style={{ color: colors.text.secondary }}
                  >
                    No transactions found.
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      isExpanded={isExpanded[transaction.id]}
                      setIsExpanded={setIsExpanded}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
