"use client";

import { useState, useRef, useEffect, ReactNode, useCallback } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  shortcut?: string;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
}

export function Tooltip({
  children,
  content,
  shortcut,
  position = "top",
  delay = 300,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay, disabled]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Adjust position if tooltip would overflow viewport
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    // Check if tooltip would overflow and flip if needed
    if (position === "top" && triggerRect.top - tooltipRect.height < 8) {
      newPosition = "bottom";
    } else if (position === "bottom" && triggerRect.bottom + tooltipRect.height > viewportHeight - 8) {
      newPosition = "top";
    } else if (position === "left" && triggerRect.left - tooltipRect.width < 8) {
      newPosition = "right";
    } else if (position === "right" && triggerRect.right + tooltipRect.width > viewportWidth - 8) {
      newPosition = "left";
    }

    if (newPosition !== actualPosition) {
      setActualPosition(newPosition);
    }
  }, [isVisible, position, actualPosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute z-[60] px-2.5 py-1.5 text-xs font-ui
            bg-gray-800/95 text-gray-100 rounded-md shadow-lg
            border border-gray-700/50 backdrop-blur-sm
            pointer-events-none
            animate-in fade-in duration-150
            ${typeof content === "string" ? "whitespace-nowrap" : ""}
            ${positionStyles[actualPosition]}
          `}
        >
          {typeof content === "string" ? <span>{content}</span> : content}
          {shortcut && typeof content === "string" && (
            <span className="ml-2 text-gray-400 font-mono text-[10px] bg-gray-700/50 px-1.5 py-0.5 rounded">
              {shortcut}
            </span>
          )}
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowStyles[actualPosition]}`}
          />
        </div>
      )}
    </div>
  );
}

// Convenience component for icon buttons with tooltips
interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
  shortcut?: string;
  tooltipPosition?: TooltipPosition;
  children: ReactNode;
}

export function TooltipButton({
  tooltip,
  shortcut,
  tooltipPosition = "top",
  children,
  ...props
}: TooltipButtonProps) {
  return (
    <Tooltip content={tooltip} shortcut={shortcut} position={tooltipPosition}>
      <button {...props}>{children}</button>
    </Tooltip>
  );
}
