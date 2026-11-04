"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../cn";

export interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}

/** "Nothing here yet — here is what to do". */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
	return (
		<div className={cn("flex flex-1 flex-col items-center justify-center p-6 text-center", className)}>
			{Icon ? (
				<div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
					<Icon className="size-6" aria-hidden />
				</div>
			) : null}
			<p className="m-0 text-base font-semibold text-gray-900">{title}</p>
			{description ? <p className="m-0 mt-1 text-sm text-gray-500">{description}</p> : null}
			{action ? <div className="mt-4">{action}</div> : null}
		</div>
	);
}

export interface PanelPlaceholderProps {
	children: ReactNode;
	/** `panel` keeps a grey frame the size of the container; `bare` for a spot inside an already framed block. */
	variant?: "panel" | "bare";
	className?: string;
}

/** Placeholder where content will appear ("select a dialog", "no transcript"). */
export function PanelPlaceholder({ children, variant = "panel", className }: PanelPlaceholderProps) {
	return (
		<div className={cn("flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center text-center text-sm text-gray-500", variant === "panel" && "rounded-2xl border border-gray-200 bg-gray-50", className)}>
			{children}
		</div>
	);
}
