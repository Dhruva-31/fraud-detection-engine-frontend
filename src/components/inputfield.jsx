import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import colors from "../styles/colors";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="flex flex-col">
      <label
        className="block text-md font-medium"
        style={{ color: colors.text.secondary }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 rounded-md outline-none pr-12"
          style={{
            backgroundColor: colors.bg.input,
            border: `1px solid ${colors.bg.hover}`,
            color: colors.text.secondary,
          }}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <FaEyeSlash color={colors.text.secondary} />
            ) : (
              <FaEye color={colors.text.secondary} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}