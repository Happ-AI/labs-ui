"use client";

import { type ClipboardEvent, type KeyboardEvent, type Ref, useCallback, useId, useMemo, useRef, useState } from "react";

import { cn } from "../cn";

export interface CodeInputProps {
	length?: number;
	value?: string;
	onChange?: (value: string) => void;
	/** Fires once every cell holds a valid character. */
	onComplete?: (value: string) => void;
	label?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	error?: boolean;
	pattern?: RegExp;
	className?: string;
	id?: string;
	"aria-label"?: string;
	ref?: Ref<HTMLDivElement>;
}

const DIGIT = /^\d$/;

/** One-time code input: one cell per character, auto-advance, backspace back, paste fills from the caret. */
export function CodeInput({ length = 6, value, onChange, onComplete, label, disabled, autoFocus, error, pattern = DIGIT, className, id, "aria-label": ariaLabel, ref }: CodeInputProps) {
	const autoId = useId();
	const groupId = id ?? autoId;
	const inputs = useRef<Array<HTMLInputElement | null>>([]);
	const [internal, setInternal] = useState("");
	const current = value ?? internal;
	const cells = useMemo(() => Array.from({ length }, (_, i) => current[i] ?? ""), [current, length]);

	const commit = useCallback(
		(next: string) => {
			if (value === undefined) setInternal(next);
			onChange?.(next);
			if (next.length === length && [...next].every((ch) => pattern.test(ch))) onComplete?.(next);
		},
		[value, onChange, onComplete, length, pattern],
	);

	const focusCell = (i: number) => {
		const el = inputs.current[Math.max(0, Math.min(length - 1, i))];
		el?.focus();
		el?.select();
	};

	const onCellChange = (i: number, raw: string) => {
		const ch = raw.slice(-1);
		if (ch && !pattern.test(ch)) return;
		const chars = cells.slice();
		chars[i] = ch;
		commit(chars.join(""));
		if (ch) focusCell(i + 1);
	};

	const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace") {
			const chars = cells.slice();
			if (cells[i]) {
				chars[i] = "";
				commit(chars.join(""));
				return;
			}
			e.preventDefault();
			chars[i - 1] = "";
			commit(chars.join(""));
			focusCell(i - 1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			focusCell(i - 1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			focusCell(i + 1);
		}
	};

	const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const filtered = [...e.clipboardData.getData("text").trim()].filter((ch) => pattern.test(ch)).join("");
		if (!filtered) return;
		const chars = cells.slice();
		for (let k = 0; k < filtered.length && i + k < length; k += 1) chars[i + k] = filtered[k]!;
		commit(chars.join(""));
		focusCell(Math.min(i + filtered.length, length - 1));
	};

	return (
		<div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
			{label ? (
				<label htmlFor={`${groupId}-0`} className="text-sm font-medium text-gray-950">
					{label}
				</label>
			) : null}
			<div role="group" aria-label={ariaLabel ?? label} className="flex items-center justify-center gap-3">
				{cells.map((cell, i) => (
					<input
						key={i}
						ref={(el) => {
							inputs.current[i] = el;
						}}
						id={`${groupId}-${i}`}
						type="text"
						inputMode="numeric"
						autoComplete="one-time-code"
						maxLength={1}
						disabled={disabled}
						autoFocus={autoFocus && i === 0}
						aria-invalid={error || undefined}
						aria-label={`${i + 1}`}
						value={cell}
						onChange={(e) => onCellChange(i, e.target.value)}
						onKeyDown={(e) => onKeyDown(i, e)}
						onPaste={(e) => onPaste(i, e)}
						onFocus={(e) => e.target.select()}
						className={cn(
							"size-12 rounded-lg border border-gray-300 bg-white text-center text-xl font-semibold text-gray-950 outline-none transition-colors focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/20 disabled:pointer-events-none disabled:opacity-50",
							cell && "border-brand-600",
							error && "border-error-600",
						)}
					/>
				))}
			</div>
		</div>
	);
}
