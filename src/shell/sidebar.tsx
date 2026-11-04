"use client";

import { Check, ChevronDown, ChevronsUpDown, type LucideIcon, Plus } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { type ElementType, forwardRef, type ReactNode } from "react";

import { cn } from "../cn";

const STROKE = 1.67;
const POPOVER = "shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)]";
const ITEM = "flex h-9 cursor-pointer items-center gap-2 rounded-[8px] px-2 text-sm font-medium text-gray-700 outline-none data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900";

export interface SidebarWorkspace {
	id: string;
	name: string;
	logoUrl?: string;
}

/** Row label that fades its last 16px instead of an ellipsis. */
export function SidebarRowLabel({ className, children }: { className?: string; children: ReactNode }) {
	return <span className={cn("min-w-0 flex-1 overflow-hidden text-left whitespace-nowrap [mask-image:linear-gradient(to_right,#000_calc(100%-16px),transparent)]", className)}>{children}</span>;
}

function WorkspaceBadge({ label, logoUrl }: { label: string; logoUrl?: string }) {
	if (logoUrl) return <img src={logoUrl} alt="" className="size-5 shrink-0 rounded-[6.667px] object-cover" loading="lazy" draggable={false} />;
	return <span className="flex size-5 shrink-0 items-center justify-center rounded-[6.667px] bg-primary text-[10px] font-medium text-always-white">{label.toUpperCase()}</span>;
}

export interface WorkspaceSwitcherProps {
	name: string;
	initial?: string;
	logoUrl?: string;
	workspaces?: SidebarWorkspace[];
	currentId?: string;
	onSelect?: (id: string) => void;
	onCreate?: () => void;
	createLabel?: string;
	onClick?: () => void;
	className?: string;
}

/** Company/workspace picker at the top of the sidebar. Without `workspaces`+`onSelect` it is a plain button. */
export function WorkspaceSwitcher({ name, initial, logoUrl, workspaces, currentId, onSelect, onCreate, createLabel = "Create workspace", onClick, className }: WorkspaceSwitcherProps) {
	const trigger = cn("press flex h-9 w-full items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)] hover:bg-gray-50 data-[state=open]:bg-gray-50", className);
	const inner = (
		<>
			<span className="flex min-w-0 flex-1 items-center gap-2">
				<WorkspaceBadge label={initial ?? name.slice(0, 1)} logoUrl={logoUrl} />
				<SidebarRowLabel className="text-sm font-medium text-gray-900">{name}</SidebarRowLabel>
			</span>
			<ChevronsUpDown aria-hidden className="size-5 shrink-0 text-gray-500" strokeWidth={STROKE} />
		</>
	);

	if (!workspaces || !onSelect) {
		return (
			<button type="button" onClick={onClick} className={trigger}>
				{inner}
			</button>
		);
	}

	const sorted = [...workspaces].sort((a, b) => a.name.localeCompare(b.name));
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button type="button" className={trigger}>
					{inner}
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content align="start" sideOffset={4} className={cn("z-50 flex max-h-[320px] min-w-[var(--radix-dropdown-menu-trigger-width)] flex-col rounded-xl border border-gray-200 bg-white p-1", POPOVER)}>
					<div className="min-h-0 flex-1 overflow-y-auto">
						{sorted.map((ws) => (
							<DropdownMenu.Item key={ws.id} onSelect={() => onSelect(ws.id)} className={cn(ITEM, "justify-between")}>
								<span className="flex min-w-0 items-center gap-2">
									<WorkspaceBadge label={ws.name.slice(0, 1)} logoUrl={ws.logoUrl} />
									<span className="min-w-0 truncate">{ws.name}</span>
								</span>
								{ws.id === currentId ? <Check aria-label="current" className="size-4 shrink-0 text-primary" strokeWidth={2} /> : null}
							</DropdownMenu.Item>
						))}
					</div>
					{onCreate ? (
						<div className="shrink-0">
							<DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
							<DropdownMenu.Item onSelect={() => onCreate()} className={ITEM}>
								<span className="flex size-5 shrink-0 items-center justify-center text-gray-500">
									<Plus className="size-4" strokeWidth={2} />
								</span>
								{createLabel}
							</DropdownMenu.Item>
						</div>
					) : null}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

export interface SidebarNavTabProps {
	icon: LucideIcon;
	label: string;
	active?: boolean;
	muted?: boolean;
	count?: number;
	trailing?: ReactNode;
	onClick?: () => void;
	href?: string;
	/** Router link (next/link, react-router Link adapter); defaults to <a>. */
	linkComponent?: ElementType;
	className?: string;
}

export function SidebarNavTab({ icon: Icon, label, active = false, muted = false, count, trailing, onClick, href, linkComponent: LinkComponent = "a", className }: SidebarNavTabProps) {
	const classes = cn(
		"press flex h-8 w-full items-center gap-2 overflow-hidden rounded-xl px-2 text-sm font-medium no-underline focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:outline-none",
		active ? "bg-gray-200 text-gray-900" : cn("hover:bg-gray-100", muted ? "text-gray-500" : "text-gray-600"),
		className,
	);
	const content = (
		<>
			<Icon className={cn("size-5 shrink-0", active && "text-brand-600")} strokeWidth={STROKE} aria-hidden />
			<SidebarRowLabel>{label}</SidebarRowLabel>
			{trailing ? <span className="ml-auto flex shrink-0 items-center">{trailing}</span> : count && count > 0 ? <span className="ml-auto shrink-0 rounded-full bg-error-50 px-1.5 py-px text-[11px] leading-4 font-semibold text-error-700">{count > 99 ? "99+" : count}</span> : null}
		</>
	);
	if (href) {
		return (
			<LinkComponent href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={classes}>
				{content}
			</LinkComponent>
		);
	}
	return (
		<button type="button" onClick={onClick} aria-current={active ? "page" : undefined} className={classes}>
			{content}
		</button>
	);
}

export function SidebarSectionLabel({ children, className }: { children: ReactNode; className?: string }) {
	return <span className={cn("px-2 text-xs font-medium whitespace-nowrap text-gray-600", className)}>{children}</span>;
}

export interface UserAccountChipProps {
	email: string;
	open?: boolean;
	onClick?: () => void;
	className?: string;
}

/** Account row at the sidebar foot; usually the trigger of an account menu (forwards ref for `asChild`). */
export const UserAccountChip = forwardRef<HTMLButtonElement, UserAccountChipProps>(function UserAccountChip({ email, open, onClick, className, ...rest }, ref) {
	return (
		<button
			ref={ref}
			type="button"
			onClick={onClick}
			aria-haspopup="menu"
			aria-expanded={open}
			className={cn("press flex h-9 w-full items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50", className)}
			{...rest}
		>
			<span className="flex min-w-0 items-center gap-[7px]">
				<span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
					{email.slice(0, 1).toUpperCase()}
				</span>
				<SidebarRowLabel className="text-sm font-medium text-gray-900">{email}</SidebarRowLabel>
			</span>
			<ChevronDown aria-hidden className={cn("size-5 shrink-0 text-gray-500 transition-transform duration-200 ease-[var(--ease-out-strong)]", open && "rotate-180")} strokeWidth={STROKE} />
		</button>
	);
});
