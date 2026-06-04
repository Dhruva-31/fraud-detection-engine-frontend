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
  required = true,
  autoComplete = "off",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-sm font-medium"
        style={{ color: colors.text.secondary }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full p-2 rounded-lg outline-none pr-12 placeholder:text-slate-400 transition-all"
          style={{
            backgroundColor: colors.bg.input,
            border: `2px solid ${
              focused ? colors.brand.red : colors.bg.hover
            }`,
            color: colors.text.primary,
          }}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <FaEyeSlash
                color={colors.text.secondary}
                size={16}
              />
            ) : (
              <FaEye
                color={colors.text.secondary}
                size={16}
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
}