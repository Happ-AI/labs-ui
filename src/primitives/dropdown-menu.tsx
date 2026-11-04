"use client";

import { Check, ChevronRight, Circle } from "lucide-react";
import { DropdownMenu as P } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../cn";

const SURFACE =
	"z-[1210] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-2xl border border-border bg-white p-2 text-gray-900 shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95";
const ROW = "relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 outline-hidden select-none focus:bg-primary-transparent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-gray-500";

export const DropdownMenu = (props: ComponentProps<typeof P.Root>) => <P.Root {...props} />;
export const DropdownMenuPortal = (props: ComponentProps<typeof P.Portal>) => <P.Portal {...props} />;
export const DropdownMenuTrigger = (props: ComponentProps<typeof P.Trigger>) => <P.Trigger {...props} />;
export const DropdownMenuGroup = (props: ComponentProps<typeof P.Group>) => <P.Group {...props} />;
export const DropdownMenuRadioGroup = (props: ComponentProps<typeof P.RadioGroup>) => <P.RadioGroup {...props} />;
export const DropdownMenuSub = (props: ComponentProps<typeof P.Sub>) => <P.Sub {...props} />;

export function DropdownMenuContent({ className, sideOffset = 4, ...props }: ComponentProps<typeof P.Content>) {
	return (
		<P.Portal>
			<P.Content sideOffset={sideOffset} className={cn(SURFACE, "max-h-(--radix-dropdown-menu-content-available-height)", className)} {...props} />
		</P.Portal>
	);
}

export function DropdownMenuItem({ className, inset, variant = "default", ...props }: ComponentProps<typeof P.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
	return (
		<P.Item
			data-inset={inset}
			data-variant={variant}
			className={cn(ROW, "data-[inset]:pl-10 data-[variant=destructive]:text-error-700 data-[variant=destructive]:focus:bg-error-50 data-[variant=destructive]:*:[svg]:text-error-700!", className)}
			{...props}
		/>
	);
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof P.CheckboxItem>) {
	return (
		<P.CheckboxItem className={cn(ROW, "pl-9", className)} {...props}>
			<span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center">
				<P.ItemIndicator>
					<Check className="size-4" />
				</P.ItemIndicator>
			</span>
			{children}
		</P.CheckboxItem>
	);
}

export function DropdownMenuRadioItem({ className, children, ...props }: ComponentProps<typeof P.RadioItem>) {
	return (
		<P.RadioItem className={cn(ROW, "pl-9", className)} {...props}>
			<span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center">
				<P.ItemIndicator>
					<Circle className="size-2 fill-current" />
				</P.ItemIndicator>
			</span>
			{children}
		</P.RadioItem>
	);
}

export function DropdownMenuLabel({ className, inset, ...props }: ComponentProps<typeof P.Label> & { inset?: boolean }) {
	return <P.Label data-inset={inset} className={cn("px-3 py-1.5 text-xs font-medium text-gray-500 data-[inset]:pl-9", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof P.Separator>) {
	return <P.Separator className={cn("-mx-2 my-1 h-px bg-border", className)} {...props} />;
}

export function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
	return <span className={cn("ml-auto text-xs tracking-widest text-gray-500", className)} {...props} />;
}

export function DropdownMenuSubTrigger({ className, inset, children, ...props }: ComponentProps<typeof P.SubTrigger> & { inset?: boolean }) {
	return (
		<P.SubTrigger data-inset={inset} className={cn(ROW, "data-[state=open]:bg-gray-100", className)} {...props}>
			{children}
			<ChevronRight className="ml-auto size-4" />
		</P.SubTrigger>
	);
}

export function DropdownMenuSubContent({ className, ...props }: ComponentProps<typeof P.SubContent>) {
	return <P.SubContent className={cn(SURFACE, className)} {...props} />;
}
