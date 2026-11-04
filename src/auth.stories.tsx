import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ForgotPasswordScreen, SignInScreen, type SignInScreenTexts, SignUpScreen, VerifyCodeScreen } from "./index";

const SIGN_IN: SignInScreenTexts = {
	title: "Вход в Happ Labs",
	subtitle: "Видеоаналитика для вашего бизнеса",
	signUpTab: "Регистрация",
	signInTab: "Вход",
	emailLabel: "Почта",
	emailPlaceholder: "you@company.com",
	passwordLabel: "Пароль",
	passwordPlaceholder: "Введите пароль",
	rememberLabel: "Запомнить меня",
	forgotLabel: "Забыли пароль?",
	submitLabel: "Войти",
	submittingLabel: "Входим…",
	googleLabel: "Войти через Google",
	noAccountText: "Нет аккаунта?",
	signUpLinkLabel: "Зарегистрироваться",
};

/** The auth layout of labs-client: form column + dark brand pane. */
function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid min-h-screen w-full grid-cols-1 bg-white p-[15px] md:grid-cols-[640fr_848fr] md:p-6">
			<section className="flex min-h-full flex-col items-center justify-center py-10">
				<div className="w-full max-w-[360px]">{children}</div>
			</section>
			<aside aria-hidden className="relative hidden overflow-hidden rounded-[32px] bg-ink md:block">
				<p className="absolute inset-x-8 bottom-8 m-0 font-mono text-[11px] tracking-[0.08em] text-brand-600 uppercase">{"// cameras see · the system acts"}</p>
			</aside>
		</div>
	);
}

function SignIn(props: { serverError?: string; isSubmitting?: boolean; emailError?: string; prefill?: boolean }) {
	const [email, setEmail] = useState(props.prefill ? "owner@cafe.ua" : "");
	const [password, setPassword] = useState(props.prefill ? "secret" : "");
	const [remember, setRemember] = useState(true);
	return (
		<Layout>
			<SignInScreen
				email={email}
				password={password}
				onEmailChange={setEmail}
				onPasswordChange={setPassword}
				remember={remember}
				onRememberChange={setRemember}
				onSubmit={() => undefined}
				canSubmit={Boolean(email && password)}
				onGoogle={() => undefined}
				forgotHref="#"
				signUpHref="#"
				texts={SIGN_IN}
				{...props}
			/>
		</Layout>
	);
}

const meta = { title: "Labs UI/Auth/Screens", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const SignInEmpty: Story = { render: () => <SignIn /> };
export const SignInFilled: Story = { render: () => <SignIn prefill /> };
export const SignInSubmitting: Story = { render: () => <SignIn prefill isSubmitting /> };
export const SignInError: Story = { render: () => <SignIn prefill serverError="Неверная почта или пароль" emailError="Проверьте почту" /> };
export const SignInPhone: Story = { render: () => <SignIn />, globals: { viewport: { value: "phone" } } };

function SignUp({ weak }: { weak?: boolean }) {
	const [email, setEmail] = useState("owner@cafe.ua");
	const [password, setPassword] = useState(weak ? "abc" : "Str0ng-pass!");
	return (
		<Layout>
			<SignUpScreen
				email={email}
				password={password}
				onEmailChange={setEmail}
				onPasswordChange={setPassword}
				onSubmit={() => undefined}
				canSubmit={!weak}
				passwordError={weak ? "Пароль слишком простой" : undefined}
				passwordStrength={{
					strength: weak ? "weak" : "strong",
					rules: [
						{ key: "len", label: "Не меньше 8 символов", passed: !weak },
						{ key: "digit", label: "Есть цифра", passed: !weak },
						{ key: "case", label: "Строчные и заглавные", passed: !weak },
					],
					texts: { weak: "Слабый", fair: "Средний", strong: "Надёжный" },
				}}
				onGoogle={() => undefined}
				signInHref="#"
				texts={{ ...SIGN_IN, title: "Регистрация", submitLabel: "Создать аккаунт", submittingLabel: "Создаём…", haveAccountText: "Уже есть аккаунт?", signInLinkLabel: "Войти" }}
			/>
		</Layout>
	);
}
export const SignUpStrong: Story = { render: () => <SignUp /> };
export const SignUpWeak: Story = { render: () => <SignUp weak /> };

function Verify({ error }: { error?: boolean }) {
	const [code, setCode] = useState(error ? "12" : "");
	return (
		<Layout>
			<VerifyCodeScreen
				code={code}
				onCodeChange={setCode}
				onSubmit={() => undefined}
				codeLength={4}
				canSubmit={code.length === 4}
				codeError={error ? "Неверный код" : undefined}
				serverError={error ? "Код устарел — запросите новый" : undefined}
				onResend={() => undefined}
				texts={{ title: "Подтвердите почту", subtitle: "Отправили код на owner@cafe.ua", codeLabel: "Код", submitLabel: "Подтвердить", submittingLabel: "Проверяем…", validText: "Не пришёл код?", resendLabel: "Отправить ещё раз" }}
			/>
		</Layout>
	);
}
export const VerifyCode: Story = { render: () => <Verify /> };
export const VerifyCodeError: Story = { render: () => <Verify error /> };

function Forgot({ sent }: { sent?: boolean }) {
	const [email, setEmail] = useState("owner@cafe.ua");
	return (
		<Layout>
			<ForgotPasswordScreen
				email={email}
				onEmailChange={setEmail}
				onSubmit={() => undefined}
				canSubmit={!sent}
				backHref="#"
				texts={{ title: sent ? "Проверьте почту" : "Восстановление пароля", subtitle: sent ? "Если аккаунт существует, мы отправили ссылку." : "Пришлём ссылку для сброса.", emailLabel: "Почта", emailPlaceholder: "you@company.com", submitLabel: "Отправить ссылку", submittingLabel: "Отправляем…", backLabel: "Назад ко входу" }}
			/>
		</Layout>
	);
}
export const ForgotPassword: Story = { render: () => <Forgot /> };
export const ForgotPasswordSent: Story = { render: () => <Forgot sent /> };
