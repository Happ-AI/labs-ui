"use client";

import { type ReactNode, useId } from "react";

import { Button } from "../button";
import { Field } from "../field";
import { Checkbox } from "../primitives/checkbox";
import { useLabsText } from "../text";
import { AuthFooterLink, AuthGoogleButton, AuthHeader, type AuthLinkComponent, AuthSegmentedTabs, AuthServerError, type AuthTab, PasswordStrengthMeter, type PasswordStrengthMeterProps } from "./auth-parts";
import { CodeInput } from "./code-input";

function AuthForm({ disabled, onSubmit, children }: { disabled: boolean; onSubmit: () => void; children: ReactNode }) {
	return (
		<form
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				if (!disabled) onSubmit();
			}}
			className="flex flex-col gap-4"
		>
			{children}
		</form>
	);
}

function Submit({ disabled, busy, label, busyLabel }: { disabled: boolean; busy: boolean; label: string; busyLabel: string }) {
	return (
		<Button type="submit" size="lg" disabled={disabled} className="mt-2 w-full" data-attr="auth-submit">
			{busy ? busyLabel : label}
		</Button>
	);
}

/* ── Sign in ─────────────────────────────────────────────────────────────── */

export interface SignInScreenTexts {
	revealPasswordLabel?: string;
	hidePasswordLabel?: string;
	title: string;
	subtitle: string;
	signUpTab: string;
	signInTab: string;
	emailLabel: string;
	emailPlaceholder: string;
	passwordLabel: string;
	passwordPlaceholder: string;
	rememberLabel: string;
	forgotLabel: string;
	submitLabel: string;
	submittingLabel: string;
	googleLabel: string;
	noAccountText: string;
	signUpLinkLabel: string;
}

export interface SignInScreenProps {
	email: string;
	password: string;
	onEmailChange: (next: string) => void;
	onPasswordChange: (next: string) => void;
	remember?: boolean;
	onRememberChange?: (next: boolean) => void;
	onSubmit: () => void;
	onTabChange?: (tab: AuthTab) => void;
	isSubmitting?: boolean;
	canSubmit?: boolean;
	emailError?: string;
	passwordError?: string;
	serverError?: string;
	/** Google entry is shown only when one of these is set. */
	googleHref?: string;
	onGoogle?: () => void;
	forgotHref?: string;
	signUpHref?: string;
	linkComponent?: AuthLinkComponent;
	logo?: ReactNode;
	texts: SignInScreenTexts;
}

export function SignInScreen(p: SignInScreenProps) {
	const t = useLabsText();
	const rememberId = useId();
	const disabled = Boolean(p.isSubmitting) || p.canSubmit === false;
	const Link = p.linkComponent;
	const forgotClass = "press text-sm font-semibold text-link hover:text-primary-hover";
	return (
		<div className="flex flex-col gap-8">
			<AuthHeader logo={p.logo} title={p.texts.title} subtitle={p.texts.subtitle} tabs={<AuthSegmentedTabs value="sign-in" onChange={p.onTabChange} signUpLabel={p.texts.signUpTab} signInLabel={p.texts.signInTab} />} />
			<AuthForm disabled={disabled} onSubmit={p.onSubmit}>
				<Field label={p.texts.emailLabel} type="email" autoComplete="email" autoFocus placeholder={p.texts.emailPlaceholder} value={p.email} onChange={p.onEmailChange} error={p.emailError} />
				<Field
					label={p.texts.passwordLabel}
					type="password"
					revealable
					revealLabel={p.texts.revealPasswordLabel ?? t("auth.reveal_password", "Show password")}
					hideLabel={p.texts.hidePasswordLabel ?? t("auth.hide_password", "Hide password")}
					autoComplete="current-password"
					placeholder={p.texts.passwordPlaceholder}
					value={p.password}
					onChange={p.onPasswordChange}
					error={p.passwordError}
				/>
				<div className="flex items-center justify-between gap-3">
					<label htmlFor={rememberId} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
						<Checkbox id={rememberId} checked={p.remember ?? false} onCheckedChange={(next) => p.onRememberChange?.(next === true)} />
						{p.texts.rememberLabel}
					</label>
					{p.forgotHref ? (
						Link ? (
							<Link href={p.forgotHref} className={forgotClass}>
								{p.texts.forgotLabel}
							</Link>
						) : (
							<a href={p.forgotHref} className={forgotClass}>
								{p.texts.forgotLabel}
							</a>
						)
					) : null}
				</div>
				<Submit disabled={disabled} busy={Boolean(p.isSubmitting)} label={p.texts.submitLabel} busyLabel={p.texts.submittingLabel} />
				{p.googleHref || p.onGoogle ? <AuthGoogleButton label={p.texts.googleLabel} href={p.googleHref} onClick={p.onGoogle} /> : null}
				<AuthServerError>{p.serverError}</AuthServerError>
			</AuthForm>
			<AuthFooterLink text={p.texts.noAccountText} linkLabel={p.texts.signUpLinkLabel} href={p.signUpHref} onClick={p.signUpHref ? undefined : () => p.onTabChange?.("sign-up")} linkComponent={p.linkComponent} />
		</div>
	);
}

/* ── Sign up ─────────────────────────────────────────────────────────────── */

export interface SignUpScreenTexts {
	revealPasswordLabel?: string;
	hidePasswordLabel?: string;
	title: string;
	subtitle: string;
	signUpTab: string;
	signInTab: string;
	emailLabel: string;
	emailPlaceholder: string;
	passwordLabel: string;
	passwordPlaceholder: string;
	submitLabel: string;
	submittingLabel: string;
	googleLabel: string;
	haveAccountText: string;
	signInLinkLabel: string;
}

export interface SignUpScreenProps {
	email: string;
	password: string;
	onEmailChange: (next: string) => void;
	onPasswordChange: (next: string) => void;
	onSubmit: () => void;
	onTabChange?: (tab: AuthTab) => void;
	isSubmitting?: boolean;
	canSubmit?: boolean;
	emailError?: string;
	passwordError?: string;
	passwordStrength?: PasswordStrengthMeterProps;
	serverError?: string;
	googleHref?: string;
	onGoogle?: () => void;
	signInHref?: string;
	linkComponent?: AuthLinkComponent;
	logo?: ReactNode;
	texts: SignUpScreenTexts;
}

export function SignUpScreen(p: SignUpScreenProps) {
	const t = useLabsText();
	const disabled = Boolean(p.isSubmitting) || p.canSubmit === false;
	return (
		<div className="flex flex-col gap-8">
			<AuthHeader logo={p.logo} title={p.texts.title} subtitle={p.texts.subtitle} tabs={<AuthSegmentedTabs value="sign-up" onChange={p.onTabChange} signUpLabel={p.texts.signUpTab} signInLabel={p.texts.signInTab} />} />
			<AuthForm disabled={disabled} onSubmit={p.onSubmit}>
				<Field label={p.texts.emailLabel} type="email" autoComplete="email" autoFocus placeholder={p.texts.emailPlaceholder} value={p.email} onChange={p.onEmailChange} error={p.emailError} />
				<Field
					label={p.texts.passwordLabel}
					type="password"
					revealable
					revealLabel={p.texts.revealPasswordLabel ?? t("auth.reveal_password", "Show password")}
					hideLabel={p.texts.hidePasswordLabel ?? t("auth.hide_password", "Hide password")}
					autoComplete="new-password"
					placeholder={p.texts.passwordPlaceholder}
					value={p.password}
					onChange={p.onPasswordChange}
					error={p.passwordError}
				/>
				{p.passwordStrength ? <PasswordStrengthMeter {...p.passwordStrength} /> : null}
				<Submit disabled={disabled} busy={Boolean(p.isSubmitting)} label={p.texts.submitLabel} busyLabel={p.texts.submittingLabel} />
				{p.googleHref || p.onGoogle ? <AuthGoogleButton label={p.texts.googleLabel} href={p.googleHref} onClick={p.onGoogle} /> : null}
				<AuthServerError>{p.serverError}</AuthServerError>
			</AuthForm>
			<AuthFooterLink text={p.texts.haveAccountText} linkLabel={p.texts.signInLinkLabel} href={p.signInHref} onClick={p.signInHref ? undefined : () => p.onTabChange?.("sign-in")} linkComponent={p.linkComponent} />
		</div>
	);
}

/* ── Verify code ─────────────────────────────────────────────────────────── */

export interface VerifyCodeScreenTexts {
	title: string;
	subtitle: string;
	codeLabel: string;
	submitLabel: string;
	submittingLabel: string;
	validText: string;
	resendLabel: string;
}

export interface VerifyCodeScreenProps {
	code: string;
	onCodeChange: (next: string) => void;
	onComplete?: (code: string) => void;
	onSubmit: () => void;
	onResend?: () => void;
	codeLength?: number;
	isSubmitting?: boolean;
	canSubmit?: boolean;
	codeError?: string;
	serverError?: string;
	logo?: ReactNode;
	texts: VerifyCodeScreenTexts;
}

export function VerifyCodeScreen(p: VerifyCodeScreenProps) {
	const disabled = Boolean(p.isSubmitting) || p.canSubmit === false;
	return (
		<div className="flex flex-col gap-8">
			<AuthHeader logo={p.logo} title={p.texts.title} subtitle={p.texts.subtitle} />
			<AuthForm disabled={disabled} onSubmit={p.onSubmit}>
				<CodeInput length={p.codeLength ?? 6} value={p.code} onChange={p.onCodeChange} onComplete={p.onComplete} error={Boolean(p.codeError)} autoFocus aria-label={p.texts.codeLabel} disabled={p.isSubmitting} />
				{p.codeError ? <p className="m-0 text-center text-xs text-error-700">{p.codeError}</p> : null}
				<Submit disabled={disabled} busy={Boolean(p.isSubmitting)} label={p.texts.submitLabel} busyLabel={p.texts.submittingLabel} />
				<AuthServerError>{p.serverError}</AuthServerError>
			</AuthForm>
			<AuthFooterLink text={p.texts.validText} linkLabel={p.texts.resendLabel} onClick={p.onResend} />
		</div>
	);
}

/* ── Forgot password ─────────────────────────────────────────────────────── */

export interface ForgotPasswordScreenTexts {
	title: string;
	subtitle: string;
	emailLabel: string;
	emailPlaceholder: string;
	submitLabel: string;
	submittingLabel: string;
	backLabel: string;
}

export interface ForgotPasswordScreenProps {
	email: string;
	onEmailChange: (next: string) => void;
	onSubmit: () => void;
	isSubmitting?: boolean;
	canSubmit?: boolean;
	emailError?: string;
	serverError?: string;
	backHref?: string;
	onBack?: () => void;
	linkComponent?: AuthLinkComponent;
	logo?: ReactNode;
	texts: ForgotPasswordScreenTexts;
}

export function ForgotPasswordScreen(p: ForgotPasswordScreenProps) {
	const disabled = Boolean(p.isSubmitting) || p.canSubmit === false;
	return (
		<div className="flex flex-col gap-8">
			<AuthHeader logo={p.logo} title={p.texts.title} subtitle={p.texts.subtitle} />
			<AuthForm disabled={disabled} onSubmit={p.onSubmit}>
				<Field label={p.texts.emailLabel} type="email" autoComplete="email" autoFocus placeholder={p.texts.emailPlaceholder} value={p.email} onChange={p.onEmailChange} error={p.emailError} />
				<Submit disabled={disabled} busy={Boolean(p.isSubmitting)} label={p.texts.submitLabel} busyLabel={p.texts.submittingLabel} />
				<AuthServerError>{p.serverError}</AuthServerError>
			</AuthForm>
			<AuthFooterLink linkLabel={p.texts.backLabel} href={p.backHref} onClick={p.onBack} leadingArrow linkComponent={p.linkComponent} />
		</div>
	);
}
