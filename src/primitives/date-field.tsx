import { cn } from "../cn";
import { CalendarDays, X } from "lucide-react";
import { Popover } from "radix-ui";
import { type ReactNode, useEffect, useState } from "react";
import { DayPicker, type DateRange, type Locale } from "react-day-picker";
import { enUS } from "react-day-picker/locale";

/* Date fields: one pill look on every device.
 * - Mouse/trackpad: our calendar (react-day-picker) in a popover, Monday-first, in `locale`.
 * - Touch (iOS/Android): transparent native <input type="date"> laid over the pill, so a tap
 *   opens the OS calendar — the best picker on a phone, and the pill still looks like ours. */

const toDate = (iso: string): Date | undefined => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
	const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
	return new Date(y, m - 1, d);
};
const toIso = (d: Date | undefined): string => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "");

/** "21 Oct" / "21 окт." — the year only when it is not the current one. */
export function formatDayShort(iso: string, lang = "en-US"): string {
	const d = toDate(iso);
	if (!d) return "";
	const opts: Intl.DateTimeFormatOptions = d.getFullYear() === new Date().getFullYear() ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" };
	return new Intl.DateTimeFormat(lang, opts).format(d);
}

export interface DateFieldLabels {
	/** Placeholder of the start / end half on touch devices. */
	from?: string;
	to?: string;
	last7?: string;
	last30?: string;
	reset?: string;
	clear?: string;
}

const DEFAULT_LABELS: Required<DateFieldLabels> = { from: "From", to: "to", last7: "7 days", last30: "30 days", reset: "Reset", clear: "Clear" };

/** Touch-first devices get native pickers. */
export function useTouchPicker(): boolean {
	const query = "(pointer: coarse)";
	const [touch, setTouch] = useState(() => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches);
	useEffect(() => {
		if (typeof window.matchMedia !== "function") return;
		const m = window.matchMedia(query);
		const on = () => setTouch(m.matches);
		m.addEventListener("change", on);
		return () => m.removeEventListener("change", on);
	}, []);
	return touch;
}

const PILL = "relative inline-flex h-10 min-w-0 items-center gap-2 rounded-xl border border-border bg-white px-3 text-sm text-gray-950 transition-colors hover:border-gray-300 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/15";
const ACTIVE = "border-brand-600/50 bg-brand-25";
const NATIVE = "absolute inset-0 h-full w-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full";

const CALENDAR = {
	root: "p-3 text-sm",
	months: "relative flex flex-col gap-4 sm:flex-row",
	month: "flex flex-col gap-3",
	month_caption: "flex h-8 items-center justify-center px-9 font-semibold capitalize",
	caption_label: "text-sm",
	nav: "absolute inset-x-0 top-0 flex h-8 items-center justify-between",
	button_previous: "flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30",
	button_next: "flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30",
	chevron: "size-4 fill-current",
	month_grid: "border-collapse",
	weekdays: "flex",
	weekday: "w-9 text-[11px] font-medium uppercase text-gray-500",
	week: "mt-1 flex",
	day: "relative size-9 p-0 text-center",
	day_button: "size-9 rounded-lg tabular-nums hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-brand-800",
	today: "font-semibold text-brand-800",
	selected: "[&>button]:bg-ink [&>button]:text-ink-text [&>button]:hover:bg-ink",
	range_middle: "bg-gray-100 [&>button]:!bg-transparent [&>button]:!text-gray-950 [&>button]:rounded-none",
	range_start: "rounded-l-lg bg-gray-100",
	range_end: "rounded-r-lg bg-gray-100",
	outside: "text-gray-300",
	disabled: "text-gray-300 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
	hidden: "invisible",
};

function ClearButton({ onClick, label }: { onClick: () => void; label: string }) {
	return (
		<button type="button" onClick={onClick} aria-label={label} className="relative z-10 -mr-1 flex size-6 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100">
			<X className="size-3.5" aria-hidden />
		</button>
	);
}

function DesktopPopover({ trigger, children, open, onOpenChange }: { trigger: ReactNode; children: ReactNode; open: boolean; onOpenChange: (o: boolean) => void }) {
	return (
		<Popover.Root open={open} onOpenChange={onOpenChange}>
			<Popover.Trigger asChild>{trigger}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content align="start" sideOffset={6} collisionPadding={12} className="z-50 rounded-2xl border border-border bg-white shadow-xl outline-none">
					{children}
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

export interface DateRangeValue {
	from: string;
	to: string;
}

export interface DateRangeFieldProps {
	/** Accessible name and the placeholder when no period is set. */
	label: string;
	/** ISO days ("2026-10-26"); "" = open end. */
	from: string;
	to: string;
	onChange: (v: DateRangeValue) => void;
	/** Force native inputs (true) or the calendar (false); default: native on touch devices. */
	native?: boolean;
	locale?: Locale;
	labels?: DateFieldLabels;
	className?: string;
}

/** A period filter in one control. */
export function DateRangeField({ label, from, to, onChange, native, locale = enUS, labels, className }: DateRangeFieldProps) {
	const l = { ...DEFAULT_LABELS, ...labels };
	const lang = locale.code ?? "en-US";
	const fmt = (iso: string) => formatDayShort(iso, lang);
	const touch = useTouchPicker();
	const useNative = native ?? touch;
	const [open, setOpen] = useState(false);
	const has = Boolean(from || to);
	const text = has ? `${from ? fmt(from) : "…"} – ${to ? fmt(to) : "…"}` : label;
	const clear = () => onChange({ from: "", to: "" });

	if (useNative) {
		return (
			<div role="group" aria-label={label} className={cn(PILL, "gap-0 px-0", has && ACTIVE, className)}>
				<CalendarDays className="ml-3 size-4 shrink-0 text-gray-500" aria-hidden />
				<span className="relative flex h-full min-w-0 flex-1 items-center px-2">
					<span className={cn("truncate", !from && "text-gray-500")}>{from ? fmt(from) : l.from}</span>
					<input type="date" aria-label={`${label}: ${l.from}`} value={from} max={to || undefined} onChange={(e) => onChange({ from: e.target.value, to })} className={NATIVE} />
				</span>
				<span aria-hidden className="text-gray-400">–</span>
				<span className="relative flex h-full min-w-0 flex-1 items-center px-2">
					<span className={cn("truncate", !to && "text-gray-500")}>{to ? fmt(to) : l.to}</span>
					<input type="date" aria-label={`${label}: ${l.to}`} value={to} min={from || undefined} onChange={(e) => onChange({ from, to: e.target.value })} className={NATIVE} />
				</span>
				{has ? <span className="pr-2"><ClearButton onClick={clear} label={`${l.clear}: ${label}`} /></span> : null}
			</div>
		);
	}

	const selected: DateRange | undefined = has ? { from: toDate(from), to: toDate(to) } : undefined;
	return (
		<span className={cn("inline-flex", className)}>
			<DesktopPopover
				open={open}
				onOpenChange={setOpen}
				trigger={
					<button type="button" aria-label={has ? `${label}: ${text}` : label} className={cn(PILL, "cursor-pointer", has && ACTIVE, has && "pr-9")}>
						<CalendarDays className="size-4 shrink-0 text-gray-500" aria-hidden />
						<span className={cn("truncate whitespace-nowrap", !has && "text-gray-500")}>{text}</span>
					</button>
				}
			>
				<DayPicker
					mode="range"
					locale={locale}
					weekStartsOn={1}
					selected={selected}
					defaultMonth={toDate(to) ?? toDate(from) ?? new Date()}
					disabled={{ after: new Date() }}
					endMonth={new Date()}
					onSelect={(r) => onChange({ from: toIso(r?.from), to: toIso(r?.to) })}
					classNames={CALENDAR}
				/>
				<div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
					{(
						[
							[l.last7, 6],
							[l.last30, 29],
						] as const
					).map(([name, back]) => (
						<button
							key={name}
							type="button"
							className="h-8 rounded-lg px-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-100"
							onClick={() => {
								const end = new Date();
								const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - back);
								onChange({ from: toIso(start), to: toIso(end) });
								setOpen(false);
							}}
						>
							{name}
						</button>
					))}
					<button type="button" disabled={!has} className="ml-auto h-8 rounded-lg px-2.5 text-[13px] font-medium text-link hover:bg-brand-25 disabled:opacity-40" onClick={() => (clear(), setOpen(false))}>
						{l.reset}
					</button>
				</div>
			</DesktopPopover>
			{has ? <span className="-ml-8 flex items-center"><ClearButton onClick={clear} label={`${l.clear}: ${label}`} /></span> : null}
		</span>
	);
}

export interface DateFieldProps {
	/** Accessible name and the placeholder when empty. */
	label: string;
	/** ISO day ("2026-10-26"); "" = not set. */
	value: string;
	onChange: (v: string) => void;
	/** Adds a reset cross (for "up to date" filters). */
	clearable?: boolean;
	native?: boolean;
	locale?: Locale;
	labels?: Pick<DateFieldLabels, "clear">;
	className?: string;
}

/** One day, past or today. */
export function DateField({ label, value, onChange, native, clearable, locale = enUS, labels, className }: DateFieldProps) {
	const l = { ...DEFAULT_LABELS, ...labels };
	const lang = locale.code ?? "en-US";
	const touch = useTouchPicker();
	const useNative = native ?? touch;
	const [open, setOpen] = useState(false);
	const text = value ? formatDayShort(value, lang) : label;

	if (useNative) {
		return (
			<span className={cn(PILL, value && clearable && ACTIVE, className)}>
				<CalendarDays className="size-4 shrink-0 text-gray-500" aria-hidden />
				<span className={cn("truncate", !value && "text-gray-500")}>{text}</span>
				<input type="date" aria-label={label} value={value} max={toIso(new Date())} onChange={(e) => onChange(e.target.value)} className={NATIVE} />
				{value && clearable ? <ClearButton onClick={() => onChange("")} label={`${l.clear}: ${label}`} /> : null}
			</span>
		);
	}

	return (
		<span className={cn("inline-flex", className)}>
			<DesktopPopover
				open={open}
				onOpenChange={setOpen}
				trigger={
					<button type="button" aria-label={value ? `${label}: ${text}` : label} className={cn(PILL, "cursor-pointer", value && clearable && ACTIVE, value && clearable && "pr-9")}>
						<CalendarDays className="size-4 shrink-0 text-gray-500" aria-hidden />
						<span className={cn("whitespace-nowrap", !value && "text-gray-500")}>{text}</span>
					</button>
				}
			>
				<DayPicker
					mode="single"
					locale={locale}
					weekStartsOn={1}
					selected={toDate(value)}
					defaultMonth={toDate(value) ?? new Date()}
					disabled={{ after: new Date() }}
					endMonth={new Date()}
					onSelect={(d) => {
						if (!d && !clearable) return;
						onChange(toIso(d));
						setOpen(false);
					}}
					classNames={CALENDAR}
				/>
			</DesktopPopover>
			{value && clearable ? <span className="-ml-8 flex items-center"><ClearButton onClick={() => onChange("")} label={`${l.clear}: ${label}`} /></span> : null}
		</span>
	);
}
