"use client";

import { type Ref, useImperativeHandle, useRef } from "react";

import { cn } from "./cn";

export interface VideoPlayerHandle {
	seekTo: (seconds: number) => void;
	play: () => void;
	pause: () => void;
}

export interface VideoPlayerProps {
	src: string;
	/** Seek here once metadata is loaded (e.g. 5 s before the event). */
	startAt?: number;
	poster?: string;
	className?: string;
	ref?: Ref<VideoPlayerHandle>;
}

/** Native <video> with the Labs accent: no player library, works everywhere incl. iOS fullscreen. */
export function VideoPlayer({ src, startAt, poster, className, ref }: VideoPlayerProps) {
	const el = useRef<HTMLVideoElement>(null);
	useImperativeHandle(ref, () => ({
		seekTo: (s) => {
			if (el.current) el.current.currentTime = s;
		},
		play: () => void el.current?.play(),
		pause: () => el.current?.pause(),
	}));
	return (
		<video
			ref={el}
			src={src}
			poster={poster}
			controls
			playsInline
			preload="metadata"
			onLoadedMetadata={(e) => {
				if (startAt && startAt > 0) e.currentTarget.currentTime = startAt;
			}}
			className={cn("block aspect-video w-full bg-ink accent-[#ff7a1a]", className)}
		/>
	);
}
