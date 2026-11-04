"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../button";
import { cn } from "../cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface DataPaginationLabels {
	rowsPerPage?: string;
	previousPage?: string;
	nextPage?: string;
}

export interface DataPaginationProps {
	/** Zero-based page index. */
	page: number;
	pageSize: number;
	totalCount: number;
	onPageChange: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	labels?: DataPaginationLabels;
	className?: string;
}

const DEFAULT_LABELS: Required<DataPaginationLabels> = { rowsPerPage: "Rows per page", previousPage: "Previous page", nextPage: "Next page" };

/** "1–20 / 134" with previous/next; optional page-size select. */
export function DataPagination({ page, pageSize, totalCount, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50, 100], labels, className }: DataPaginationProps) {
	const l = { ...DEFAULT_LABELS, ...labels };
	const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;
	const start = totalCount === 0 ? 0 : page * pageSize + 1;
	const end = Math.min((page + 1) * pageSize, totalCount);

	return (
		<div className={cn("flex items-center justify-end gap-3 py-3", className)}>
			<span className="text-[13px] text-gray-500 tabular-nums">
				{start}&ndash;{end} / {totalCount}
			</span>
			{onPageSizeChange ? (
				<div className="flex items-center gap-2">
					<span className="text-[13px] text-gray-500">{l.rowsPerPage}</span>
					<Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
						<SelectTrigger size="sm" className="w-[76px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((o) => (
								<SelectItem key={o} value={String(o)}>
									{o}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			) : null}
			<nav aria-label="pagination" className="flex items-center gap-1">
				<Button variant="ghost" size="icon-sm" aria-label={l.previousPage} disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
					<ChevronLeft className="size-5" />
				</Button>
				<Button variant="ghost" size="icon-sm" aria-label={l.nextPage} disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
					<ChevronRight className="size-5" />
				</Button>
			</nav>
		</div>
	);
}
