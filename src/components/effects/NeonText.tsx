import { HTMLAttributes } from "react";

type NeonColor = "pink" | "cyan" | "violet" | "amber";

interface NeonTextProps extends HTMLAttributes<HTMLElement> {
  color?: NeonColor;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  pulse?: boolean;
}

const colorStyles: Record<NeonColor, string> = {
  pink: "neon-pink",
  cyan: "neon-cyan",
  violet: "neon-violet",
  amber: "neon-amber",
};

export function NeonText({
  className = "",
  color = "pink",
  as: Tag = "span",
  pulse = false,
  children,
  ...props
}: NeonTextProps) {
  const pulseStyles = pulse ? "animate-pulse" : "";

  return (
    <Tag
      className={`${colorStyles[color]} ${pulseStyles} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
