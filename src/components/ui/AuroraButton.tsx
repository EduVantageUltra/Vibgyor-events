"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./MagneticButton";

type Variant = "primary" | "ghost" | "outline";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  icon?: boolean;
  magnetic?: boolean;
};

const base =
  "group relative inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-semibold tracking-tight transition-[transform,box-shadow] duration-300 active:scale-[0.97] overflow-hidden select-none";

const variants: Record<Variant, string> = {
  primary:
    "text-ink bg-gradient-to-r from-iris via-cyan to-amber shadow-[0_10px_40px_-10px_rgba(124,92,255,0.7)]",
  outline:
    "text-fog bg-white/[0.03] border border-white/15 hover:border-white/30 backdrop-blur-md",
  ghost: "text-fog hover:bg-white/[0.06]",
};

function Inner({
  children,
  variant = "primary",
  icon = true,
}: Pick<CommonProps, "children" | "variant" | "icon">) {
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      )}
      <span className="relative z-10">{children}</span>
      {icon && (
        <span
          className={cn(
            "relative z-10 grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            variant === "primary" ? "bg-black/15" : "bg-white/10"
          )}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
        </span>
      )}
    </>
  );
}

export function AuroraButton({
  href,
  onClick,
  type = "button",
  children,
  className,
  variant = "primary",
  icon = true,
  magnetic = true,
  ...rest
}: CommonProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const content = (
    <Inner variant={variant} icon={icon}>
      {children}
    </Inner>
  );
  const cls = cn(base, variants[variant], className);

  const el = href ? (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={cls} {...rest}>
      {content}
    </button>
  );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
