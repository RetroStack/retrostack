import { HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

const sizeStyles = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[1600px]",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = "", size = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
