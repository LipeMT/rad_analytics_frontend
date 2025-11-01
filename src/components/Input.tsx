import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-2 rounded-lg border shadow-sm outline-none
          placeholder-gray-400 text-gray-800
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
          ${className || ""}
        `}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
};
