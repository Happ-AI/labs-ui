"use client";

import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from "lucide-react";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** sonner in the Labs look. Theme follows the `theme` prop (default light). */
export function Toaster({ theme = "light", ...props }: ToasterProps) {
	return (
		<Sonner
			theme={theme}
			className="toaster group"
			icons={{
				success: <CircleCheck className="size-4" />,
				info: <Info className="size-4" />,
				warning: <TriangleAlert className="size-4" />,
				error: <OctagonX className="size-4" />,
				loading: <Loader2 className="size-4 animate-spin" />,
			}}
			style={{ "--normal-bg": "var(--white)", "--normal-text": "var(--black)", "--normal-border": "var(--border-color)", "--border-radius": "12px" } as CSSProperties}
			{...props}
		/>
	);
}
