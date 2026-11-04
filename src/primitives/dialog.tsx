"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../cn";
import { useLabsText } from "../text";

export const Dialog = (props: ComponentProps<typeof DialogPrimitive.Root>) => <DialogPrimitive.Root {...props} />;
export const DialogTrigger = (props: ComponentProps<typeof DialogPrimitive.Trigger>) => <DialogPrimitive.Trigger {...props} />;
export const DialogPortal = (props: ComponentProps<typeof DialogPrimitive.Portal>) => <DialogPrimitive.Portal {...props} />;
export const DialogClose = (props: ComponentProps<typeof DialogPrimitive.Close>) => <DialogPrimitive.Close {...props} />;

export function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
	return <DialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-ink/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className)} {...props} />;
}

export function DialogContent({ className, children, showCloseButton = true, ...props }: ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
	const t = useLabsText();
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				className={cn(
					"fixed top-1/2 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl border border-border bg-white p-6 text-gray-950 shadow-[0_8px_32px_0_rgb(0_0_0/12%)] duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 max-md:w-[calc(100%-2rem)] sm:min-h-[200px] sm:min-w-[480px]",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton ? (
					<DialogPrimitive.Close className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-primary">
						<X className="size-4" aria-hidden />
						<span className="sr-only">{t("dialog.close", "Close")}</span>
					</DialogPrimitive.Close>
				) : null}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
	return <div className={cn("flex flex-col gap-2 pr-8 text-center sm:text-left", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
	return <div className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
	return <DialogPrimitive.Title className={cn("m-0 text-lg leading-7 font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
	return <DialogPrimitive.Description className={cn("m-0 text-sm text-gray-600", className)} {...props} />;
}
