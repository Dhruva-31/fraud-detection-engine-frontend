import { NavLink, useNavigate } from "react-router-dom";
import colors from "../styles/colors";
import { LogOut, Shield } from "lucide-react";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav
      className="flex justify-between items-center px-4 py-4"
      style={{ backgroundColor: colors.bg.surface, borderBottom: `1px solid ${colors.bg.border}` }}
    >
      <div className="flex flex-row gap-2">
        <Shield className="w-6 h-6 text-[#FF3B3B]" />
        <h1
          className="text-lg font-bold"
          style={{ color: colors.text.primary }}
        >
          Fraud Detection
        </h1>
      </div>
      <div className="flex flex-row items-center gap-6">
        <NavLink
          to="/home"
          style={({ isActive }) => ({
            color: isActive ? colors.text.primary : colors.text.secondary,
            textDecoration: isActive ? "underline" : "none",
            textDecorationColor: isActive ? colors.brand.red : undefined,
            textUnderlineOffset: "4px",
          })}
          className="hover:opacity-80 transition-all text-md"
        >
          Home
        </NavLink>

        <NavLink
          to="/analytics"
          style={({ isActive }) => ({
            color: isActive ? colors.text.primary : colors.text.secondary,
            textDecoration: isActive ? "underline" : "none",
            textDecorationColor: isActive ? colors.brand.red : undefined,
            textUnderlineOffset: "4px",
          })}
          className="hover:opacity-70 transition-all text-md"
        >
          Analytics
        </NavLink>
        <div
          className="w-px h-6"
          style={{ backgroundColor: colors.bg.border }}
        />
        <button onClick={handleLogout}>
          <LogOut color={colors.text.secondary} size="20px" />
        </button>
      </div>
    </nav>
  );
}
