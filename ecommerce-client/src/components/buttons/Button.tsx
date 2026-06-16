import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

function Button({
  children,
  onClick,
  type = "button"
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
      px-6
      py-3
      rounded-xl
      bg-blue-600
      text-white
      hover:bg-blue-700
      transition-all
      duration-300
      "
    >
      {children}
    </button>
  );
}

export default Button;