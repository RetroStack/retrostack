"use client";

import { HTMLAttributes, forwardRef } from "react";

interface GridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  overlay?: boolean;
}

export const GridBackground = forwardRef<HTMLDivElement, GridBackgroundProps>(
  ({ className = "", animated = true, overlay = true, children, ...props }, ref) => {
    const gridStyles = animated ? "grid-background grid-animated" : "grid-background";

    return (
      <div
        ref={ref}
        className={`relative ${gridStyles} ${className}`}
        {...props}
      >
        {children}
        {overlay && (
          <div className="pointer-events-none absolute inset-0 gradient-overlay" />
        )}
      </div>
    );
  }
);

GridBackground.displayName = "GridBackground";
