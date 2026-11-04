"use client";

import { Eye, EyeOff } from "lucide-react";
import { type InputHTMLAttributes, useId, useState } from "react";

import { cn } from "./cn";

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
	label: string;
	value: string;
	onChange: (next: string) => void;
	error?: string;
	/** Adds a show/hide toggle; meaningful on a password field. */
	revealable?: boolean;
	revealLabel?: string;
	hideLabel?: string;
}

export function Field({ label, value, onChange, error, revealable = false, revealLabel = "Показать пароль", hideLabel = "Скрыть пароль", type = "text", id, className, ...rest }: FieldProps) {
	const auto = useId();
	const fieldId = id ?? auto;
	const [revealed, setRevealed] = useState(false);
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<label htmlFor={fieldId} className="text-sm font-medium text-gray-950">
				{label}
			</label>
			<div className="relative">
				<input
					id={fieldId}
					type={revealable && revealed ? "text" : type}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? `${fieldId}-error` : undefined}
					className={cn(
						"h-11 w-full rounded-lg border border-border bg-white px-3.5 text-[15px] text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:bg-gray-50 disabled:text-gray-500",
						revealable && "pr-11",
						error && "border-error-600",
					)}
					{...rest}
				/>
				{revealable ? (
					<button type="button" tabIndex={-1} onClick={() => setRevealed((v) => !v)} aria-label={revealed ? hideLabel : revealLabel} className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:text-gray-800">
						{revealed ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
					</button>
				) : null}
			</div>
			{error ? (
				<span id={`${fieldId}-error`} className="text-[13px] text-error-700">
					{error}
				</span>
			) : null}
		</div>
	);
}
