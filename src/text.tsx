"use client";

import { createContext, type ReactNode, useContext } from "react";

export type LabsTextValues = Record<string, string | number>;

/** `(key, defaultText, values?) => string` — the consumer maps keys to its i18n; unknown keys fall back to the English default. */
export type LabsTextResolver = (key: string, defaultText: string, values?: LabsTextValues) => string;

export function interpolateLabsText(text: string, values?: LabsTextValues): string {
	if (!values) return text;
	return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}

const identity: LabsTextResolver = (_key, fallback, values) => interpolateLabsText(fallback, values);
const LabsTextContext = createContext<LabsTextResolver>(identity);

export function LabsTextProvider({ resolve, children }: { resolve: LabsTextResolver; children: ReactNode }) {
	return <LabsTextContext.Provider value={resolve}>{children}</LabsTextContext.Provider>;
}

export function useLabsText(): LabsTextResolver {
	return useContext(LabsTextContext);
}
