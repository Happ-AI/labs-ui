"use client";

import { useState } from "react";

import { Button } from "../button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";

export interface DeleteDialogProps {
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	/** When set, the user must type it before confirm enables. */
	verificationText?: string;
	busy?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

/** Body of a destructive confirmation; lives inside the consumer's <Dialog><DialogContent>. */
export function DeleteDialog({ title, description, confirmLabel = "Delete", cancelLabel = "Cancel", verificationText, busy, onCancel, onConfirm }: DeleteDialogProps) {
	const [typed, setTyped] = useState("");
	const verified = !verificationText || typed === verificationText;
	return (
		<>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				{description ? <DialogDescription>{description}</DialogDescription> : null}
			</DialogHeader>
			{verificationText ? (
				<div className="flex flex-col gap-2">
					<Label htmlFor="delete-dialog-verification" className="text-gray-600">
						{verificationText}
					</Label>
					<Input id="delete-dialog-verification" autoComplete="off" autoFocus value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={verificationText} disabled={busy} />
				</div>
			) : null}
			<DialogFooter>
				<Button size="sm" variant="outline" onClick={onCancel} disabled={busy}>
					{cancelLabel}
				</Button>
				<Button size="sm" variant="destructive" onClick={onConfirm} disabled={!verified || busy}>
					{confirmLabel}
				</Button>
			</DialogFooter>
		</>
	);
}
