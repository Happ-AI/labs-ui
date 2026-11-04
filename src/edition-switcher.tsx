"use client";

import { Check, ChevronsUpDown, Code2, type LucideIcon, Store } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { cn } from "./cn";

export type Edition = "business" | "developer";

export interface EditionCopy {
	title: string;
	label: Record<Edition, string>;
	hint: Record<Edition, string>;
}

export const EDITION_COPY_RU: EditionCopy = {
	title: "Режим кабинета",
	label: { business: "Для бизнеса", developer: "Для разработчика" },
	hint: {
		business: "Отчёт смены, нарушения и камеры. Без технических настроек.",
		developer: "Все настройки: модели, сценарии, агент, разметка.",
	},
};

const ICON: Record<Edition, LucideIcon> = { business: Store, developer: Code2 };
const ORDER: Edition[] = ["business", "developer"];

/** Sidebar-foot switch between the two editions of one workspace. */
export function EditionSwitcher({ edition, onChange, copy = EDITION_COPY_RU, className }: { edition: Edition; onChange: (e: Edition) => void; copy?: EditionCopy; className?: string }) {
	const Trigger = ICON[edition];
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button type="button" aria-label={`${copy.title}: ${copy.label[edition]}`} className={cn("flex h-11 w-full items-center gap-2.5 rounded-[10px] border border-border bg-white px-2.5 text-left text-[13px] text-gray-700 hover:bg-gray-50 data-[state=open]:bg-gray-50", className)}>
					<Trigger className="size-4 shrink-0" strokeWidth={1.8} aria-hidden />
					<span className="min-w-0 flex-1 truncate">{copy.label[edition]}</span>
					<ChevronsUpDown className="size-3.5 shrink-0 text-gray-500" aria-hidden />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content side="top" align="start" sideOffset={6} className="z-50 flex w-[264px] flex-col gap-0.5 rounded-xl border border-border bg-white p-1 shadow-[0_12px_32px_rgb(16_24_40/12%)]">
					<DropdownMenu.Label className="px-2 pt-1.5 pb-1 text-xs font-medium text-gray-500">{copy.title}</DropdownMenu.Label>
					<DropdownMenu.RadioGroup value={edition} onValueChange={(v) => onChange(v as Edition)}>
						{ORDER.map((e) => {
							const Icon = ICON[e];
							return (
								<DropdownMenu.RadioItem key={e} value={e} className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 outline-none data-[highlighted]:bg-gray-100">
									<span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", e === "business" ? "bg-brand-25 text-brand-800" : "bg-gray-100 text-gray-600")}>
										<Icon className="size-4" strokeWidth={1.8} aria-hidden />
									</span>
									<span className="flex min-w-0 flex-1 flex-col">
										<span className="text-sm font-medium text-gray-950">{copy.label[e]}</span>
										<span className="text-xs text-pretty text-gray-600">{copy.hint[e]}</span>
									</span>
									<DropdownMenu.ItemIndicator className="mt-0.5 shrink-0">
										<Check className="size-4 text-primary" strokeWidth={2} aria-hidden />
									</DropdownMenu.ItemIndicator>
								</DropdownMenu.RadioItem>
							);
						})}
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
