import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Button, EditionSwitcher, Field } from "./index";

function PasswordField() {
	const [v, setV] = useState("");
	return <Field label="Пароль" type="password" value={v} onChange={setV} revealable error={v === "x" ? "Слишком короткий" : undefined} />;
}

describe("labs-ui", () => {
	it("Field: label is wired to the input, reveal toggles the type, error is announced", async () => {
		render(<PasswordField />);
		const input = screen.getByLabelText("Пароль");
		expect(input).toHaveAttribute("type", "password");
		await userEvent.click(screen.getByRole("button", { name: "Показать пароль" }));
		expect(input).toHaveAttribute("type", "text");
		await userEvent.type(input, "x");
		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(input).toHaveAccessibleDescription("Слишком короткий");
	});

	it("Button defaults to type=button and respects disabled", async () => {
		const onClick = vi.fn();
		render(
			<Button disabled onClick={onClick}>
				Войти
			</Button>,
		);
		const b = screen.getByRole("button", { name: "Войти" });
		expect(b).toHaveAttribute("type", "button");
		await userEvent.click(b);
		expect(onClick).not.toHaveBeenCalled();
	});

	it("EditionSwitcher names the current edition", () => {
		render(<EditionSwitcher edition="developer" onChange={() => undefined} />);
		expect(screen.getByRole("button", { name: "Режим кабинета: Для разработчика" })).toBeInTheDocument();
	});
});
