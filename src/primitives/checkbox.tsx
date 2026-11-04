"use client";

import { Check } from "lucide-react";
import { Checkbox as P } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../cn";

export function Checkbox({ className, ...props }: ComponentProps<typeof P.Root>) {
	return (
		<P.Root
			className={cn("peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-gray-300 bg-white outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-always-white", className)}
			{...props}
		>
			<P.Indicator>
				<Check className="size-3" strokeWidth={3} />
			</P.Indicator>
		</P.Root>
	);
}
