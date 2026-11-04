import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { CodeInput, DataPagination, DeleteDialog, Dialog, DialogContent, SignInScreen, type SignInScreenTexts, VerifyCodeScreen, WorkspaceSwitcher } from "./index";

function ControlledCode({ onComplete }: { onComplete: (v: string) => void }) {
	const [v, setV] = useState("");
	return <CodeInput length={4} value={v} onChange={setV} onComplete={onComplete} aria-label="Код" />;
}

const cells = () => screen.getAllByRole("textbox") as HTMLInputElement[];

describe("CodeInput", () => {
	it("advances on type, ignores non-digits and fires onComplete once full", async () => {
		const done = vi.fn();
		render(<ControlledCode onComplete={done} />);
		await userEvent.click(cells()[0]!);
		await userEvent.keyboard("1a23");
		expect(cells().map((c) => c.value)).toEqual(["1", "2", "3", ""]);
		expect(done).not.toHaveBeenCalled();
		await userEvent.keyboard("4");
		expect(done).toHaveBeenCalledWith("1234");
	});

	it("fills from the caret on paste and drops junk", () => {
		const done = vi.fn();
		render(<ControlledCode onComplete={done} />);
		fireEvent.paste(cells()[0]!, { clipboardData: { getData: () => " 9-8 7 6 " } });
		expect(cells().map((c) => c.value)).toEqual(["9", "8", "7", "6"]);
		expect(done).toHaveBeenCalledWith("9876");
	});

	it("backspace on an empty cell clears the previous one", async () => {
		render(<ControlledCode onComplete={() => undefined} />);
		await userEvent.click(cells()[0]!);
		await userEvent.keyboard("12");
		await userEvent.keyboard("{Backspace}");
		expect(cells().map((c) => c.value)).toEqual(["1", "", "", ""]);
	});
});

describe("DataPagination", () => {
	it("shows the range, pages forward/back and disables the ends", async () => {
		const onPage = vi.fn();
		const { rerender } = render(<DataPagination page={0} pageSize={20} totalCount={45} onPageChange={onPage} labels={{ previousPage: "Назад", nextPage: "Вперёд" }} />);
		expect(screen.getByText(/1.20 \/ 45/)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Назад" })).toBeDisabled();
		await userEvent.click(screen.getByRole("button", { name: "Вперёд" }));
		expect(onPage).toHaveBeenCalledWith(1);
		rerender(<DataPagination page={2} pageSize={20} totalCount={45} onPageChange={onPage} labels={{ previousPage: "Назад", nextPage: "Вперёд" }} />);
		expect(screen.getByText(/41.45 \/ 45/)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Вперёд" })).toBeDisabled();
		await userEvent.click(screen.getByRole("button", { name: "Назад" }));
		expect(onPage).toHaveBeenLastCalledWith(1);
	});

	it("reads 0–0 for an empty list", () => {
		render(<DataPagination page={0} pageSize={20} totalCount={0} onPageChange={() => undefined} />);
		expect(screen.getByText(/0.0 \/ 0/)).toBeInTheDocument();
	});
});

describe("DeleteDialog", () => {
	const open = (props: Partial<Parameters<typeof DeleteDialog>[0]> = {}) => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		render(
			<Dialog open>
				<DialogContent>
					<DeleteDialog title="Удалить камеру?" confirmLabel="Удалить" cancelLabel="Отмена" onConfirm={onConfirm} onCancel={onCancel} {...props} />
				</DialogContent>
			</Dialog>,
		);
		return { onConfirm, onCancel };
	};

	it("confirms and cancels", async () => {
		const { onConfirm, onCancel } = open();
		expect(screen.getByRole("dialog", { name: "Удалить камеру?" })).toBeInTheDocument();
		await userEvent.click(screen.getByRole("button", { name: "Удалить" }));
		await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onCancel).toHaveBeenCalledOnce();
	});

	it("needs the verification text typed before confirm enables, and locks while busy", async () => {
		open({ verificationText: "Кафе" });
		const confirm = screen.getByRole("button", { name: "Удалить" });
		expect(confirm).toBeDisabled();
		await userEvent.type(screen.getByLabelText("Кафе"), "Кафе");
		expect(confirm).toBeEnabled();
	});
});

describe("WorkspaceSwitcher", () => {
	it("lists workspaces alphabetically, selects one and offers create", async () => {
		const onSelect = vi.fn();
		const onCreate = vi.fn();
		render(<WorkspaceSwitcher name="Кафе" currentId="b" workspaces={[{ id: "b", name: "Кафе" }, { id: "a", name: "Бар" }]} onSelect={onSelect} onCreate={onCreate} createLabel="Новая компания" />);
		await userEvent.click(screen.getByRole("button", { name: /Кафе/ }));
		const items = screen.getAllByRole("menuitem");
		expect(items.map((i) => i.textContent)).toEqual(["ББар", "ККафе", "Новая компания"]);
		await userEvent.click(items[0]!);
		expect(onSelect).toHaveBeenCalledWith("a");
	});
});

const SIGN_IN: SignInScreenTexts = {
	title: "Вход",
	subtitle: "Рады видеть",
	signUpTab: "Регистрация",
	signInTab: "Вход",
	emailLabel: "Почта",
	emailPlaceholder: "you@company.com",
	passwordLabel: "Пароль",
	passwordPlaceholder: "••••",
	rememberLabel: "Запомнить",
	forgotLabel: "Забыли пароль?",
	submitLabel: "Войти",
	submittingLabel: "Входим…",
	googleLabel: "Google",
	noAccountText: "Нет аккаунта?",
	signUpLinkLabel: "Создать",
};

describe("auth screens", () => {
	it("SignInScreen submits, blocks when it cannot, switches tabs and shows the server error", async () => {
		const onSubmit = vi.fn();
		const onTab = vi.fn();
		const { rerender } = render(<SignInScreen email="a@b.c" password="x" onEmailChange={() => undefined} onPasswordChange={() => undefined} onSubmit={onSubmit} onTabChange={onTab} texts={SIGN_IN} />);
		await userEvent.click(screen.getByRole("button", { name: "Войти" }));
		expect(onSubmit).toHaveBeenCalledOnce();
		await userEvent.click(screen.getByRole("tab", { name: "Регистрация" }));
		expect(onTab).toHaveBeenCalledWith("sign-up");
		expect(screen.queryByTestId("google-auth-button")).toBeNull();
		rerender(<SignInScreen email="" password="" onEmailChange={() => undefined} onPasswordChange={() => undefined} onSubmit={onSubmit} canSubmit={false} serverError="Неверный пароль" onGoogle={() => undefined} texts={SIGN_IN} />);
		expect(screen.getByRole("button", { name: "Войти" })).toBeDisabled();
		expect(screen.getByRole("alert")).toHaveTextContent("Неверный пароль");
		expect(screen.getByTestId("google-auth-button")).toBeInTheDocument();
	});

	it("SignInScreen password field reveals on toggle", async () => {
		render(<SignInScreen email="" password="secret" onEmailChange={() => undefined} onPasswordChange={() => undefined} onSubmit={() => undefined} texts={SIGN_IN} />);
		const input = screen.getByLabelText("Пароль");
		expect(input).toHaveAttribute("type", "password");
		await userEvent.click(screen.getByRole("button", { name: "Show password" }));
		expect(input).toHaveAttribute("type", "text");
	});

	it("VerifyCodeScreen completes a 4-digit code", async () => {
		const done = vi.fn();
		function Wrap() {
			const [c, setC] = useState("");
			return <VerifyCodeScreen code={c} onCodeChange={setC} onComplete={done} onSubmit={() => undefined} codeLength={4} texts={{ title: "Код", subtitle: "Отправили", codeLabel: "Код", submitLabel: "Готово", submittingLabel: "…", validText: "Не пришёл?", resendLabel: "Отправить ещё" }} />;
		}
		render(<Wrap />);
		await userEvent.keyboard("4321");
		expect(done).toHaveBeenCalledWith("4321");
	});
});
