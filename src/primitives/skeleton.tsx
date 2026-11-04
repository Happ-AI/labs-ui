"use client";

import type { ComponentProps } from "react";

import { cn } from "../cn";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
	return <div data-slot="skeleton" className={cn("rounded-md bg-gray-200/70 motion-safe:animate-pulse", className)} {...props} />;
}
