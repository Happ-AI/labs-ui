import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building2, Camera, CreditCard, FileText, House, Plug, Settings, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { AppFrame, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LabsMark, SidebarNavTab, SidebarSectionLabel, UserAccountChip, WorkspaceSwitcher } from "./index";

const MAIN = [
	{ key: "overview", label: "Обзор", icon: House },
	{ key: "cameras", label: "Камеры", icon: Camera },
	{ key: "events", label: "События", icon: TriangleAlert, count: 12 },
	{ key: "reports", label: "Отчёты", icon: FileText },
];
const SETTINGS = [
	{ key: "sites", label: "Точки", icon: Building2 },
	{ key: "integrations", label: "Интеграции", icon: Plug },
	{ key: "billing", label: "Оплата", icon: CreditCard },
	{ key: "settings", label: "Настройки", icon: Settings },
];

function Sidebar({ longNames }: { longNames?: boolean }) {
	const [active, setActive] = useState("overview");
	const [company, setCompany] = useState("1");
	const companies = longNames
		? [
				{ id: "1", name: "Сеть кофеен «Очень длинное название компании» — Одесса" },
				{ id: "2", name: "Бар" },
			]
		: [
				{ id: "1", name: "Кафе на Канатной" },
				{ id: "2", name: "Бар на Дерибасовской" },
			];
	return (
		<nav aria-label="Разделы" className="flex h-full w-[231px] shrink-0 flex-col overflow-hidden">
			<div className="flex min-h-0 flex-1 flex-col gap-2">
				<a href="#" className="press flex items-center gap-2 px-0.5 py-2 no-underline hover:opacity-70">
					<LabsMark size={22} className="text-gray-900" />
					<span className="text-sm font-semibold text-gray-900">Happ Labs</span>
				</a>
				<WorkspaceSwitcher name={companies.find((c) => c.id === company)!.name} workspaces={companies} currentId={company} onSelect={setCompany} onCreate={() => undefined} createLabel="Новая компания" />
				<div className="flex flex-col gap-1">
					<SidebarSectionLabel>Главное</SidebarSectionLabel>
					{MAIN.map((i) => (
						<SidebarNavTab key={i.key} icon={i.icon} label={i.label} count={i.count} active={active === i.key} onClick={() => setActive(i.key)} />
					))}
				</div>
				<div className="flex flex-col gap-1">
					<SidebarSectionLabel>Настройки</SidebarSectionLabel>
					{SETTINGS.map((i) => (
						<SidebarNavTab key={i.key} icon={i.icon} label={i.label} active={active === i.key} onClick={() => setActive(i.key)} />
					))}
				</div>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div>
						<UserAccountChip email={longNames ? "very.long.owner.email.address@company-domain.com.ua" : "owner@cafe.ua"} />
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" side="top" className="w-[215px]">
					<DropdownMenuItem variant="destructive">Выйти</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	);
}

function Frame({ longNames }: { longNames?: boolean }) {
	return (
		<AppFrame sidebar={<Sidebar longNames={longNames} />} title="Обзор" actions={<Button size="sm">Добавить камеру</Button>} contentClassName="mx-auto w-full max-w-[1125px] gap-6 p-4 md:p-6">
			<h1 className="m-0 text-2xl font-semibold">Обзор</h1>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{["Камер", "Событий", "Точек", "Отчётов"].map((t) => (
					<div key={t} className="rounded-xl border border-gray-200 bg-white p-5">
						<div className="text-sm text-gray-500">{t}</div>
						<div className="text-2xl font-semibold">12</div>
					</div>
				))}
			</div>
		</AppFrame>
	);
}

const meta = { title: "Labs UI/Shell/App frame", component: Frame, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Frame>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongNames: Story = { args: { longNames: true } };
export const Phone: Story = { globals: { viewport: { value: "phone" } } };
