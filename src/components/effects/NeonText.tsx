import { HTMLAttributes } from "react";

type NeonColor = "pink" | "cyan" | "violet" | "amber";

interface NeonTextProps extends HTMLAttributes<HTMLElement> {
  color?: NeonColor;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  pulse?: boolean;
  glow?: boolean;
}

const colorStyles: Record<NeonColor, string> = {
  pink: "neon-pink",
  cyan: "neon-cyan",
  violet: "neon-violet",
  amber: "neon-amber",
};

const glowStyles: Record<NeonColor, string> = {
  pink: "neon-glow-pink",
  cyan: "neon-glow-cyan",
  violet: "neon-glow-violet",
  amber: "neon-glow-amber",
};

export function NeonText({
  className = "",
  color = "pink",
  as: Tag = "span",
  pulse = false,
  glow = true,
  children,
  ...props
}: NeonTextProps) {
  const pulseStyles = pulse ? "animate-pulse" : "";
  const glowAnimation = glow ? glowStyles[color] : "";

  return (
    <Tag className={`${colorStyles[color]} ${pulseStyles} ${glowAnimation} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
