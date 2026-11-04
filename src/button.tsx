"use client";

import { Slot } from "radix-ui";
import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "./cn";

/** `default` is an alias of `primary` (shadcn naming kept for call sites ported from platform-ui). */
export type ButtonVariant = "primary" | "default" | "outline" | "ink" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const VARIANT: Record<ButtonVariant, string> = {
	primary: "bg-primary text-always-white hover:bg-primary-hover",
	default: "bg-primary text-always-white hover:bg-primary-hover",
	outline: "border border-border bg-white text-gray-950 hover:bg-gray-50",
	ink: "bg-ink text-ink-text hover:bg-gray-800",
	ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
	destructive: "bg-error-600 text-always-white hover:bg-error-700",
};

const SIZE: Record<ButtonSize, string> = {
	sm: "h-9 px-4 text-[13px]",
	md: "h-11 px-5 text-sm",
	lg: "h-12 px-6 text-[15px]",
	icon: "size-10",
	"icon-sm": "size-8",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/** Render the child (e.g. a router link) with the button look. */
	asChild?: boolean;
}

/** Labs pill button. Disabled keeps the shape and drops the fill, so it never reads as a live CTA. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = "primary", size = "md", className, type = "button", asChild = false, ...rest }, ref) {
	const Comp = asChild ? Slot.Root : "button";
	return (
		<Comp
			ref={ref}
			type={asChild ? undefined : type}
			className={cn(
				"press inline-flex shrink-0 no-underline items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				"disabled:cursor-not-allowed disabled:border disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400",
				variant === "ghost" && "disabled:border-transparent disabled:bg-transparent",
				VARIANT[variant],
				SIZE[size],
				className,
			)}
			{...rest}
		/>
	);
});
