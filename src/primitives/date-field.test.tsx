import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ru } from "react-day-picker/locale";

import { DateField, DateRangeField, formatDayShort } from "./date-field";

/* One look on every device: a pill with the chosen dates. Desktop opens our calendar;
 * touch devices get the OS calendar (iOS/Android) through native inputs under the pill. */

const RU = { from: "С", to: "по", last7: "7 дней", last30: "30 дней", reset: "Сбросить", clear: "Сбросить" };

describe("DateRangeField", () => {
	it("shows a placeholder, then the chosen period in one line", () => {
		const { rerender } = render(<DateRangeField label="Период" from="" to="" onChange={() => {}} native={false} locale={ru} labels={RU} />);
		expect(screen.getByRole("button", { name: /^Период/ })).toHaveTextContent("Период");
		rerender(<DateRangeField label="Период" from="2026-10-21" to="2026-10-26" onChange={() => {}} native={false} locale={ru} labels={RU} />);
		expect(screen.getByRole("button", { name: /^Период/ })).toHaveTextContent(`${formatDayShort("2026-10-21", "ru")} – ${formatDayShort("2026-10-26", "ru")}`);
	});

	it("English by default", () => {
		render(<DateRangeField label="Period" from="2026-10-21" to="" onChange={() => {}} native />);
		expect(screen.getByLabelText("Period: to")).toBeInTheDocument();
		expect(screen.getByText(formatDayShort("2026-10-21"))).toBeInTheDocument();
	});

	it("desktop: picks a range in the calendar", async () => {
		const seen: { from: string; to: string }[] = [];
		render(<DateRangeField label="Период" from="2026-10-01" to="" onChange={(v) => seen.push(v)} native={false} locale={ru} labels={RU} />);
		await userEvent.click(screen.getByRole("button", { name: /^Период/ }));
		expect(await screen.findByRole("grid")).toBeInTheDocument();
		await userEvent.click(screen.getByRole("button", { name: /, 5 октября/ }));
		expect(seen.at(-1)).toEqual({ from: "2026-10-01", to: "2026-10-05" });
	});

	it("touch: native date inputs for each end, the OS calendar opens on tap", () => {
		const seen: { from: string; to: string }[] = [];
		render(<DateRangeField label="Период" from="2026-10-01" to="" onChange={(v) => seen.push(v)} native locale={ru} labels={RU} />);
		const to = screen.getByLabelText("Период: по");
		expect(to).toHaveAttribute("type", "date");
		expect(to).toHaveAttribute("min", "2026-10-01");
		fireEvent.change(to, { target: { value: "2026-10-09" } });
		expect(seen.at(-1)).toEqual({ from: "2026-10-01", to: "2026-10-09" });
	});
});

describe("DateField", () => {
	it("touch: one native input with the same pill look", () => {
		const seen: string[] = [];
		render(<DateField label="День" value="2026-10-26" onChange={(v) => seen.push(v)} native locale={ru} />);
		expect(screen.getByText(formatDayShort("2026-10-26", "ru"))).toBeInTheDocument();
		fireEvent.change(screen.getByLabelText("День"), { target: { value: "2026-10-27" } });
		expect(seen).toEqual(["2026-10-27"]);
	});
});
