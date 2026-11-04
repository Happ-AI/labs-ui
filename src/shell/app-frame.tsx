"use client";

import { Menu, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { type ReactNode, useEffect, useState } from "react";

import { cn } from "../cn";
import { useLabsText } from "../text";

const DESKTOP_QUERY = "(min-width: 1024px)";

export interface AppFrameProps {
	sidebar: ReactNode;
	title?: ReactNode;
	actions?: ReactNode;
	/** Fixed top-right chrome of the header, after `actions`. */
	headerEnd?: ReactNode;
	/** The page is one screen: the card is exactly the viewport's height. */
	fitViewport?: boolean;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
}

/**
 * App shell: soft canvas with 12px padding, a sticky sidebar on the left, a rounded white content card on
 * the right with its own sticky header (hamburger + title, actions). Below `lg` the sidebar moves into a
 * left drawer and the card goes edge to edge. The page (html/body) is the only scroller.
 */
export function AppFrame({ sidebar, title, actions, headerEnd, fitViewport = false, children, className, contentClassName }: AppFrameProps) {
	const t = useLabsText();
	const [drawerOpen, setDrawerOpen] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(DESKTOP_QUERY);
		const onChange = () => mql.matches && setDrawerOpen(false);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return (
		<div className={cn("flex w-full items-start gap-3 bg-gray-50 p-3 text-gray-900 max-lg:gap-0 max-lg:p-0", className)}>
			<div className="sticky top-3 flex h-[calc(100dvh-24px)] shrink-0 max-lg:hidden">{sidebar}</div>

			<DialogPrimitive.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
					<DialogPrimitive.Content
						aria-describedby={undefined}
						className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-white p-3 shadow-xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left"
					>
						<DialogPrimitive.Title className="sr-only">{t("app_frame.navigation", "Navigation")}</DialogPrimitive.Title>
						<DialogPrimitive.Close aria-label={t("app_frame.close_navigation_menu", "Close navigation menu")} className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
							<X className="size-4" aria-hidden />
						</DialogPrimitive.Close>
						{/* A tap on a nav item routes and closes the drawer; controls that open their own menu opt out. */}
						<div
							className="flex h-full min-h-0 flex-1"
							onClick={(event) => {
								const target = event.target as HTMLElement | null;
								if (target?.closest("[aria-haspopup],[data-drawer-keep-open]")) return;
								if (target?.closest("a,button")) setDrawerOpen(false);
							}}
						>
							{sidebar}
						</div>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>

			<div
				className={cn(
					"flex min-w-0 flex-1 flex-col rounded-2xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] max-lg:rounded-none max-lg:border-0 max-lg:shadow-none",
					fitViewport ? "h-[calc(100dvh-24px)] max-lg:h-dvh" : "min-h-[calc(100dvh-24px)] max-lg:min-h-dvh",
				)}
			>
				<div className="sticky top-0 z-10 shrink-0 lg:-mx-px lg:-mt-[13px] lg:bg-gray-50 lg:pt-3">
					<div className="flex h-12 items-center justify-between gap-2 rounded-t-2xl border-b border-gray-200 bg-white p-2 max-lg:rounded-none lg:border-x lg:border-t">
						<div className="flex min-w-0 items-center gap-3 px-2.5 py-2.5">
							<button type="button" aria-label={t("app_frame.open_navigation_menu", "Open navigation menu")} onClick={() => setDrawerOpen(true)} className="press flex items-center justify-center text-gray-900 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:outline-none lg:hidden">
								<Menu className="size-5" strokeWidth={1.67} />
							</button>
							{title ? <span className="min-w-0 truncate text-sm font-medium text-gray-900">{title}</span> : null}
						</div>
						{actions || headerEnd ? (
							<div className="flex shrink-0 items-center gap-2">
								{actions}
								{headerEnd}
							</div>
						) : null}
					</div>
				</div>
				<div className={cn("flex flex-1 flex-col rounded-b-2xl max-lg:rounded-none", fitViewport && "min-h-0", contentClassName)}>{children}</div>
			</div>
		</div>
	);
}
