import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Inbox, LogOut, Settings } from "lucide-react";
import { useState } from "react";

import {
	Badge,
	Button,
	DataPagination,
	DeleteDialog,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	EmptyState,
	Input,
	Label,
	PanelPlaceholder,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton,
	Toaster,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./index";
import { toast } from "sonner";

const meta = { title: "Labs UI/Primitives/Data & overlays", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Badges: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge>Default</Badge>
			<Badge variant="success">Онлайн</Badge>
			<Badge variant="secondary">Офлайн</Badge>
			<Badge variant="danger-soft">Ошибка</Badge>
			<Badge variant="warning">Ожидает</Badge>
			<Badge variant="info">Инфо</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	),
};

export const FormControls: Story = {
	render: () => (
		<div className="grid max-w-[360px] gap-4">
			<div className="grid gap-1.5">
				<Label htmlFor="n">Название</Label>
				<Input id="n" placeholder="Кафе на Канатной" />
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor="e">С ошибкой</Label>
				<Input id="e" aria-invalid defaultValue="???" />
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor="d">Выключено</Label>
				<Input id="d" disabled defaultValue="readonly" />
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor="s">Протокол</Label>
				<Select>
					<SelectTrigger id="s">
						<SelectValue placeholder="Выберите…" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="rtsp">RTSP</SelectItem>
						<SelectItem value="ftp">FTP</SelectItem>
						<SelectItem value="long">Очень длинное значение, которое не помещается в одну строку списка</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	),
};

function DialogDemo() {
	const [open, setOpen] = useState(false);
	const [del, setDel] = useState(false);
	return (
		<div className="flex gap-3">
			<Button onClick={() => setOpen(true)}>Открыть диалог</Button>
			<Button variant="outline" onClick={() => setDel(true)}>
				Удалить…
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Новая камера</DialogTitle>
						<DialogDescription>Подключим за пару минут.</DialogDescription>
					</DialogHeader>
					<Input placeholder="Название" />
					<DialogFooter>
						<Button variant="outline" size="sm" onClick={() => setOpen(false)}>
							Отмена
						</Button>
						<Button size="sm">Сохранить</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={del} onOpenChange={setDel}>
				<DialogContent>
					<DeleteDialog title="Удалить компанию?" description="Камеры и отчёты будут удалены." verificationText="Кафе" confirmLabel="Удалить" cancelLabel="Отмена" onCancel={() => setDel(false)} onConfirm={() => setDel(false)} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
export const Dialogs: Story = { render: () => <DialogDemo /> };
export const DialogOpen: Story = {
	render: () => (
		<Dialog open>
			<DialogContent>
				<DeleteDialog title="Удалить камеру «У стойки»?" description="Записи останутся до конца срока хранения." confirmLabel="Удалить" cancelLabel="Отмена" onCancel={() => undefined} onConfirm={() => undefined} />
			</DialogContent>
		</Dialog>
	),
};

export const Menu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Меню</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[215px]">
				<DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
				<DropdownMenuItem>
					<Settings />
					Настройки
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Bell />
					Уведомления
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<LogOut />
					Выйти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

export const TooltipAndToast: Story = {
	render: () => (
		<TooltipProvider delayDuration={100}>
			<div className="flex gap-3">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline">Наведите</Button>
					</TooltipTrigger>
					<TooltipContent>Подсказка в цвете ink</TooltipContent>
				</Tooltip>
				<Button onClick={() => toast.success("Сохранено")}>Тост</Button>
				<Button variant="outline" onClick={() => toast.error("Не удалось сохранить")}>
					Ошибка
				</Button>
			</div>
			<Toaster />
		</TooltipProvider>
	),
};

function PagerDemo({ total }: { total: number }) {
	const [page, setPage] = useState(0);
	return <DataPagination page={page} pageSize={20} totalCount={total} onPageChange={setPage} onPageSizeChange={() => undefined} labels={{ previousPage: "Назад", nextPage: "Вперёд", rowsPerPage: "Строк" }} />;
}
export const Pagination: Story = { render: () => <PagerDemo total={134} /> };
export const PaginationEmpty: Story = { render: () => <PagerDemo total={0} /> };

export const EmptyAndLoading: Story = {
	render: () => (
		<div className="grid gap-4 md:grid-cols-2">
			<PanelPlaceholder className="min-h-[220px] py-10">
				<EmptyState icon={Inbox} title="Пока пусто" description="Подключите первую камеру — события появятся здесь." action={<Button size="sm">Подключить</Button>} />
			</PanelPlaceholder>
			<div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5">
				<Skeleton className="h-6 w-40" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>
		</div>
	),
};
