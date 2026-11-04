"use client";

import type { ComponentProps } from "react";

import { cn } from "../cn";

/** Text input in the Labs look: 44px, 8px radius, orange focus ring. */
export function Input({ className, type, ...props }: ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3.5 text-[15px] text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 aria-invalid:border-error-600 aria-invalid:focus:ring-error-600/20",
				className,
			)}
			{...props}
		/>
	);
}
