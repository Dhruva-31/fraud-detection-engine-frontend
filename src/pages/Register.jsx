import { useState } from "react";
import { Shield } from "lucide-react";
import colors from "../styles/colors";
import { useAuth } from "../context/authContext";
import InputField from "../components/inputfield";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    // Simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 chars, at least one letter, one number, and one special character
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Fill all the fields.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Enter a valid email.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters, include at least one letter, one number, and one special character.",
      );
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to Register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: colors.bg.primary }}
      className="flex items-center justify-center p-4 h-screen"
    >
      <div
        style={{
          backgroundColor: colors.bg.surface,
          border: `1px solid ${colors.bg.border}`,
          borderRadius: "8px",
        }}
        className="w-full max-w-md flex flex-col rounded-lg p-8 shadow-lg gap-4 items-center"
      >
        <div className="flex flex-col gap-3 items-center justify-center">
          <div
            style={{ backgroundColor: colors.brand.redGlow }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
          >
            <Shield className="w-6 h-6 text-[#FF3B3B]" />
          </div>

          <h2
            style={{ color: colors.text.primary }}
            className="text-2xl font-bold text-center"
          >
            Create Account
          </h2>
          <p
            style={{ color: colors.text.secondary }}
            className="text-sm text-center"
          >
            Join FraudEngine
          </p>
        </div>
        <div className="w-full flex-col flex gap-4 mb-6">
          <InputField
            label="Full Name"
            name="name"
            type="name"
            value={formData.name}
            placeholder="sunny"
            onChange={handleChange}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            placeholder="naanga4peru@gmail.com"
            onChange={handleChange}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            placeholder="********"
            onChange={handleChange}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-md font-medium mb-4 hover:opacity-70"
          style={{
            color: colors.text.primary,
            backgroundColor: loading ? colors.brand.redHover : colors.brand.red,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <div className="text-center text-lg">
          <span className="text-gray-400">Don't have an account? </span>
          <a
            href="/register"
            className="font-medium hover:text-red-400"
            style={{ color: colors.brand.red }}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
