import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "accent" | "secondary" | "outline" | "danger";
  className?: string;
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false
}: ButtonProps) {
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-[#2874F0] hover:bg-[#1259c7] text-white shadow-sm font-semibold";
      break;
    case "accent":
      variantClasses = "bg-[#FB641B] hover:bg-[#e04f0b] text-white shadow-sm font-semibold";
      break;
    case "secondary":
      variantClasses = "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm font-medium";
      break;
    case "outline":
      variantClasses = "bg-transparent hover:bg-gray-50 text-[#2874F0] border border-[#2874F0] font-medium";
      break;
    case "danger":
      variantClasses = "bg-red-600 hover:bg-red-700 text-white shadow-sm font-semibold";
      break;
    default:
      variantClasses = "bg-[#2874F0] hover:bg-[#1259c7] text-white";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6
        py-2.5
        rounded-md
        transition-all
        duration-200
        text-sm
        flex
        items-center
        justify-center
        gap-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        cursor-pointer
        active:scale-[0.98]
        ${variantClasses}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;