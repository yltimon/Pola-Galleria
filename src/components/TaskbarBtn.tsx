"use client";

import React from "react";

interface TaskbarBtnProps {
  default1?: boolean;
  inactive?: boolean;
  onHover?: boolean;
  text: string;
  className?: string;
  onClick?: () => void;
  isActive?: boolean; // New prop for filter state
}

export default function TaskbarBtn({
  default1 = false,
  inactive = false,
  onHover = false,
  text,
  className = "",
  onClick,
  isActive = false
}: TaskbarBtnProps) {
  // Determine button state styling
  const getButtonStyle = () => {
    if (inactive) return "bg-gray-300 text-gray-500 cursor-not-allowed";
    if (isActive) return "bg-blue-500 text-white shadow-md"; // Active filter style
    if (default1) return "bg-white text-black border border-gray-200";
    return "bg-white/80 text-black hover:bg-gray-100/90 transition-colors";
  };

  return (
    <button
      className={`px-4 py-2 rounded-full transition-colors ${getButtonStyle()} ${className}`}
      disabled={inactive}
      onClick={onClick}
      onMouseEnter={() => onHover && console.log('Hovered')}
    >
      {text}
    </button>
  );
}