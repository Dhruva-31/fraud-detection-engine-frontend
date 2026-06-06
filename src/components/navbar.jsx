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
      className="flex flex-wrap justify-between items-center gap-4 px-4 py-4"
      style={{
        backgroundColor: colors.bg.surface,
        borderBottom: `1px solid ${colors.bg.border}`,
      }}
    >
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Shield className="w-6 h-6" color={colors.brand.red} />
        <h1
          className="hidden sm:block text-base md:text-lg font-bold"
          style={{ color: colors.text.primary }}
        >
          Fraud Detection
        </h1>
      </div>
      <div className="flex items-center gap-3 md:gap-6 flex-wrap">
        <NavLink
          to="/home"
          style={({ isActive }) => ({
            color: isActive ? colors.text.primary : colors.text.secondary,
            textDecoration: isActive ? "underline" : "none",
            textDecorationColor: isActive ? colors.brand.red : undefined,
            textUnderlineOffset: "0.5rem",
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
            textUnderlineOffset: "0.5rem",
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
          <LogOut color={colors.text.secondary} size={20} />
        </button>
      </div>
    </nav>
  );
}
