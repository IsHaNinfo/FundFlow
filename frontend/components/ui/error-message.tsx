import React from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) return null;
  return (
    <div className={`text-red-500 text-sm text-center ${className || ""}`}>
      {message}
    </div>
  );
};