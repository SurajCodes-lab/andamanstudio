"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Auto-playing showreel: plays each film one after another (no click to load),
// muted autoplay to satisfy browser policies, with a thumbnail strip to jump.
let apiPromise: Promise<any> | null = null;
function loadYouTubeAPI(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if ((window as any).YT && (window as any).YT.Player) return Promise.resolve((window as any).YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve((window as any).YT);
    };
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
  return apiPromise;
}

export default function VideoReel({ ids }: { ids: string[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const currentRef = useRef(0);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !YT || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId: ids[0],
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            // 0 === ended -> advance to the next film automatically
            if (e.data === 0) {
              const next = (currentRef.current + 1) % ids.length;
              setCurrent(next);
              playerRef.current?.loadVideoById(ids[next]);
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jumpTo = (i: number) => {
    setCurrent(i);
    playerRef.current?.loadVideoById(ids[i]);
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      p.setVolume(80);
    } else {
      p.mute();
    }
    setMuted(!muted);
  };

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-deep shadow-[0_30px_70px_-34px_rgba(5,37,34,0.7)]">
        <div ref={hostRef} className="absolute inset-0 h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
        <button
          onClick={toggleMute}
          className="glass-dark absolute bottom-4 right-4 z-10 rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/20"
        >
          {muted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {ids.map((id, i) => (
          <button
            key={id + i}
            onClick={() => jumpTo(i)}
            aria-label={`Play film ${i + 1}`}
            className={`group relative aspect-video overflow-hidden rounded-md ring-2 transition-all duration-300 ${
              i === current ? "ring-gold-soft" : "ring-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
              alt="Film thumbnail"
              fill
              sizes="16vw"
              className="object-cover"
              unoptimized
            />
            {i === current && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink-deep/40">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gold-soft" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
