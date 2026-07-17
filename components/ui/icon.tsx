import type { LucideIcon, LucideProps } from "lucide-react";

/** §9.5 — every icon in the product goes through this wrapper so stroke-width stays consistent (1.5-1.75, refined not heavy). */
export interface IconProps extends Omit<LucideProps, "ref"> {
  icon: LucideIcon;
}

export function Icon({ icon: LucideIconComponent, strokeWidth = 1.75, size = 20, ...props }: IconProps) {
  return <LucideIconComponent strokeWidth={strokeWidth} size={size} {...props} />;
}
