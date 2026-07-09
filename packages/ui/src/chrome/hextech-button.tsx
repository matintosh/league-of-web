import type { ButtonHTMLAttributes } from "react";

export type HextechButtonVariant = "primary" | "secondary";
export type HextechButtonSize = "default" | "large";

export interface HextechButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = gold border + blue gradient (PLAY, confirm). secondary = muted outline. */
  variant?: HextechButtonVariant;
  /** large is used for the PLAY button. */
  size?: HextechButtonSize;
}

const base =
  "inline-flex cursor-pointer items-center justify-center border font-display uppercase tracking-widest transition-all duration-150 disabled:cursor-not-allowed disabled:border-grey-3 disabled:bg-none disabled:text-grey-2 disabled:shadow-none";

const variants: Record<HextechButtonVariant, string> = {
  primary:
    "border-gold-4 bg-linear-to-b from-blue-6 to-blue-7 text-gold-2 hover:border-gold-2 hover:text-gold-1 hover:shadow-[0_0_12px_var(--color-blue-2)]",
  secondary:
    "border-grey-3 bg-transparent text-grey-1 hover:border-gold-4 hover:text-gold-1",
};

const sizes: Record<HextechButtonSize, string> = {
  default: "px-8 py-2.5 text-sm",
  large: "px-14 py-4 text-base",
};

export function HextechButton({
  variant = "primary",
  size = "default",
  className,
  ...props
}: HextechButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
