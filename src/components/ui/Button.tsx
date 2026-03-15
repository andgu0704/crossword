import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500":
              variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400":
              variant === "secondary",
            "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500":
              variant === "danger",
          },
          {
            "px-3 py-1.5 text-sm min-h-[36px]": size === "sm",
            "px-4 py-2 text-base min-h-[44px]": size === "md",
            "px-6 py-3 text-lg min-h-[52px]": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
