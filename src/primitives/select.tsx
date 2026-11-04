"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Select as P } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../cn";

export const Select = (props: ComponentProps<typeof P.Root>) => <P.Root {...props} />;
export const SelectGroup = (props: ComponentProps<typeof P.Group>) => <P.Group {...props} />;
export const SelectValue = (props: ComponentProps<typeof P.Value>) => <P.Value data-slot="select-value" {...props} />;

export function SelectTrigger({ className, size = "default", children, ...props }: ComponentProps<typeof P.Trigger> & { size?: "sm" | "default" }) {
	return (
		<P.Trigger
			data-size={size}
			className={cn(
				"flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-white px-3.5 text-[15px] whitespace-nowrap text-gray-950 outline-none transition-colors hover:bg-gray-50 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-error-600 data-[placeholder]:text-gray-400 data-[size=default]:h-11 data-[size=sm]:h-9 data-[size=sm]:text-sm *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			{...props}
		>
			{children}
			<P.Icon asChild>
				<ChevronDown className="size-4 text-gray-500" />
			</P.Icon>
		</P.Trigger>
	);
}

export function SelectContent({ className, children, position = "popper", align = "start", ...props }: ComponentProps<typeof P.Content>) {
	return (
		<P.Portal>
			<P.Content
				position={position}
				align={align}
				className={cn(
					"relative z-[1210] max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-white text-gray-900 shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
					position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
					className,
				)}
				{...props}
			>
				<P.ScrollUpButton className="flex items-center justify-center py-1">
					<ChevronUp className="size-4" />
				</P.ScrollUpButton>
				<P.Viewport className={cn("p-1", position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1")}>{children}</P.Viewport>
				<P.ScrollDownButton className="flex items-center justify-center py-1">
					<ChevronDown className="size-4" />
				</P.ScrollDownButton>
			</P.Content>
		</P.Portal>
	);
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof P.Label>) {
	return <P.Label className={cn("px-2 py-1.5 text-xs text-gray-500", className)} {...props} />;
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof P.Item>) {
	return (
		<P.Item
			className={cn("relative flex w-full cursor-default items-center gap-2 rounded-lg py-2 pr-8 pl-2.5 text-sm outline-hidden select-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
			{...props}
		>
			<span className="absolute right-2 flex size-3.5 items-center justify-center">
				<P.ItemIndicator>
					<Check className="size-4 text-primary" />
				</P.ItemIndicator>
			</span>
			<P.ItemText>{children}</P.ItemText>
		</P.Item>
	);
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof P.Separator>) {
	return <P.Separator className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)} {...props} />;
}
