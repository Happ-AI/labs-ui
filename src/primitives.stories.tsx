import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import sample from "./sample.mp4";
import { ru } from "react-day-picker/locale";

import { Button, DateField, DateRangeField, type Edition, EditionSwitcher, Field, VideoPlayer } from "./index";

const meta = { title: "Labs UI/Primitives/Basics", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

const SWATCHES = [
	["--primary", "bg-primary", "Кнопки, активное"],
	["brand-600", "bg-brand-600", "Акцент Labs #ff7a1a"],
	["ink", "bg-ink", "Тёмные поверхности, видео"],
	["canvas", "bg-canvas", "Фон кабинета"],
	["error-700", "bg-error-700", "Нарушение"],
	["warning-500", "bg-warning-500", "Проверить"],
	["success-500", "bg-success-500", "Норма"],
];

export const Tokens: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{SWATCHES.map(([name, cls, use]) => (
					<div key={name} className="overflow-hidden rounded-xl border border-border bg-white">
						<div className={`h-16 ${cls}`} />
						<div className="p-3 text-xs">
							<div className="font-mono font-medium">{name}</div>
							<div className="text-gray-500">{use}</div>
						</div>
					</div>
				))}
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-[28px] leading-9 font-semibold tracking-tight">Смена 26 октября — Inter 28/36</span>
				<span className="text-[15px] text-gray-600">Основной текст 15/22, вторичный gray-600</span>
				<span className="font-mono text-xs text-gray-500">// JetBrains Mono — таймкоды, CAM-10 · 14:32:07</span>
			</div>
		</div>
	),
};

export const Buttons: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button size="lg">Смотреть нарушение</Button>
			<Button>Подтвердить</Button>
			<Button variant="outline">Всё в порядке</Button>
			<Button variant="ink">Спросить</Button>
			<Button variant="ghost">Отмена</Button>
			<Button disabled>Недоступно</Button>
			<Button size="sm" variant="outline">
				Показать ещё
			</Button>
		</div>
	),
};

function Fields() {
	const [email, setEmail] = useState("owner@cafe.ua");
	const [pass, setPass] = useState("");
	return (
		<div className="flex max-w-[360px] flex-col gap-4">
			<Field label="Почта" type="email" value={email} onChange={setEmail} />
			<Field label="Пароль" type="password" value={pass} onChange={setPass} revealable />
			<Field label="С ошибкой" value="x" onChange={() => undefined} error="Неверная почта или пароль." />
			<Field label="Выключено" value="readonly" onChange={() => undefined} disabled />
		</div>
	);
}
export const Inputs: Story = { render: () => <Fields /> };

function Switcher() {
	const [e, setE] = useState<Edition>("business");
	return (
		<div className="w-[232px]">
			<EditionSwitcher edition={e} onChange={setE} />
		</div>
	);
}
export const Edition_Switcher: Story = { name: "Edition switcher", render: () => <Switcher /> };

export const Video: Story = { render: () => <VideoPlayer src={sample} startAt={5} className="max-w-[720px] rounded-2xl" /> };

const RU_DATES = { from: "С", to: "по", last7: "7 дней", last30: "30 дней", reset: "Сбросить", clear: "Сбросить" };
function Dates({ native }: { native: boolean }) {
	const [range, setRange] = useState({ from: "", to: "" });
	const [day, setDay] = useState("");
	return (
		<div className="flex flex-wrap items-center gap-2">
			<DateRangeField label="Период" {...range} onChange={setRange} native={native} locale={ru} labels={RU_DATES} />
			<DateField label="До даты" value={day} onChange={setDay} clearable native={native} locale={ru} />
			<DateRangeField label="Period" from="" to="" onChange={() => undefined} native={native} />
		</div>
	);
}
/** Desktop: calendar in a popover. */
export const Date_Fields: Story = { name: "Date fields", render: () => <Dates native={false} /> };
/** Touch: the OS date picker opens on tap (try it in a phone simulator). */
export const Date_Fields_Touch: Story = { name: "Date fields (touch)", render: () => <Dates native /> };
