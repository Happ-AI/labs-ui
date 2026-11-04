"use client";

import { ArrowLeft } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { LabsMark } from "../brand/labs-mark";
import { cn } from "../cn";

export type AuthTab = "sign-up" | "sign-in";

export type AuthLinkComponent = ComponentType<{ href: string; className?: string; children: ReactNode }>;

const PlainLink: AuthLinkComponent = ({ href, ...rest }) => <a href={href} {...rest} />;

/** Logomark (Labs by default), title, subtitle and an optional tabs slot. */
export function AuthHeader({ title, subtitle, tabs, logo, className }: { title: string; subtitle?: string; tabs?: ReactNode; logo?: ReactNode; className?: string }) {
	return (
		<div className={cn("flex flex-col items-center text-center", className)}>
			{logo ?? <LabsMark size={48} className="text-gray-950" />}
			<h1 className="m-0 mt-6 text-2xl leading-8 font-bold text-gray-900">{title}</h1>
			{subtitle ? <p className="m-0 mt-3 text-sm leading-5 text-gray-500">{subtitle}</p> : null}
			{tabs ? <div className="mt-6 w-full">{tabs}</div> : null}
		</div>
	);
}

/** "Sign up / Log in" segmented control with a sliding pill. */
export function AuthSegmentedTabs({ value, onChange, signUpLabel, signInLabel, className }: { value: AuthTab; onChange?: (v: AuthTab) => void; signUpLabel: string; signInLabel: string; className?: string }) {
	const tabs: { key: AuthTab; label: string }[] = [
		{ key: "sign-up", label: signUpLabel },
		{ key: "sign-in", label: signInLabel },
	];
	return (
		<div role="tablist" aria-orientation="horizontal" className={cn("relative grid h-11 w-full grid-cols-2 items-center rounded-[10px] border border-border bg-light-grey p-1", className)}>
			<span aria-hidden className={cn("pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[6px] bg-white shadow-xs transition-transform duration-[250ms] ease-[var(--ease-out-strong)] motion-reduce:transition-none", value === "sign-in" && "translate-x-full")} />
			{tabs.map((tab) => {
				const active = tab.key === value;
				return (
					<button key={tab.key} type="button" role="tab" aria-selected={active} onClick={() => onChange?.(tab.key)} className={cn("press relative z-10 h-full rounded-[6px] text-sm font-semibold", active ? "text-gray-900" : "text-gray-500 hover:text-gray-900")}>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}

export function AuthFooterLink({ text, linkLabel, href, onClick, leadingArrow = false, linkComponent: LinkComp = PlainLink, className }: { text?: string; linkLabel: string; href?: string; onClick?: () => void; leadingArrow?: boolean; linkComponent?: AuthLinkComponent; className?: string }) {
	const linkClass = cn("press font-medium text-link hover:text-primary-hover", leadingArrow && "inline-flex items-center gap-1.5");
	const inner = (
		<>
			{leadingArrow ? <ArrowLeft aria-hidden className="size-4" /> : null}
			{linkLabel}
		</>
	);
	return (
		<p className={cn("m-0 text-center text-sm text-gray-500", className)}>
			{text ? <>{text} </> : null}
			{href ? (
				<LinkComp href={href} className={linkClass}>
					{inner}
				</LinkComp>
			) : (
				<button type="button" onClick={onClick} className={cn(linkClass, "cursor-pointer bg-transparent p-0")}>
					{inner}
				</button>
			)}
		</p>
	);
}

function GoogleG() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden className="size-5">
			<path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
			<path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
			<path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z" />
			<path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
		</svg>
	);
}

/** "Continue with Google" — a link when `href` is set, a button otherwise. */
export function AuthGoogleButton({ label, href, onClick, disabled, className }: { label: string; href?: string; onClick?: () => void; disabled?: boolean; className?: string }) {
	const cls = cn("press flex h-11 w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-900 shadow-xs no-underline hover:bg-gray-50 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400", className);
	const content = (
		<>
			<GoogleG />
			<span>{label}</span>
		</>
	);
	if (href && !disabled) {
		return (
			<a href={href} data-testid="google-auth-button" className={cls}>
				{content}
			</a>
		);
	}
	return (
		<button type="button" data-testid="google-auth-button" onClick={onClick} disabled={disabled} className={cls}>
			{content}
		</button>
	);
}

export type PasswordStrength = "weak" | "fair" | "strong";
export interface PasswordRule {
	key: string;
	label: string;
	passed: boolean;
}
export interface PasswordStrengthMeterProps {
	rules: PasswordRule[];
	strength: PasswordStrength;
	texts: Record<PasswordStrength, string>;
	className?: string;
}

const STRENGTH: Record<PasswordStrength, { bars: number; bar: string; text: string }> = {
	weak: { bars: 1, bar: "bg-error-600", text: "text-error-700" },
	fair: { bars: 2, bar: "bg-warning-500", text: "text-warning-700" },
	strong: { bars: 3, bar: "bg-success-500", text: "text-success-700" },
};

export function PasswordStrengthMeter({ rules, strength, texts, className }: PasswordStrengthMeterProps) {
	const s = STRENGTH[strength];
	return (
		<div className={cn("grid gap-2", className)}>
			<div className="flex items-center gap-2">
				<div className="flex flex-1 gap-1">
					{[0, 1, 2].map((i) => (
						<span key={i} className={cn("press h-1 flex-1 rounded-full", i < s.bars ? s.bar : "bg-gray-200")} />
					))}
				</div>
				<span className={cn("text-xs font-medium", s.text)}>{texts[strength]}</span>
			</div>
			<ul className="m-0 grid list-none gap-0.5 p-0">
				{rules.map((r) => (
					<li key={r.key} className={cn("press text-xs", r.passed ? "text-success-700" : "text-gray-500")}>
						{r.passed ? "✓" : "•"} {r.label}
					</li>
				))}
			</ul>
		</div>
	);
}

export function AuthServerError({ children }: { children?: ReactNode }) {
	if (!children) return null;
	return (
		<p role="alert" aria-live="polite" data-testid="form-error" className="m-0 text-center text-sm text-error-700">
			{children}
		</p>
	);
}
