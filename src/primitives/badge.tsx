"use client";

import type { ComponentProps } from "react";

import { cn } from "../cn";

export type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "info" | "danger-soft" | "destructive";

const VARIANT: Record<BadgeVariant, string> = {
	default: "bg-primary text-always-white",
	secondary: "bg-gray-100 text-gray-700",
	outline: "border-border text-gray-900",
	success: "bg-success-50 text-success-700",
	warning: "bg-warning-50 text-warning-800",
	info: "bg-blue-light-50 text-blue-light-700",
	"danger-soft": "bg-error-50 text-error-700",
	destructive: "bg-error-600 text-always-white",
};

export function Badge({ className, variant = "default", ...props }: ComponentProps<"span"> & { variant?: BadgeVariant }) {
	return (
		<span
			data-slot="badge"
			data-variant={variant}
			className={cn("inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3", VARIANT[variant], className)}
			{...props}
		/>
	);
}
