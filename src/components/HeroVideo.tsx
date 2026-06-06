"use client";

import { useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Background showreel that loops seamlessly WITHOUT YouTube's end-screen
// recommendations (seeks back ~2s before the end). Loads lazily and only runs
// its loop-watch while the hero is actually on-screen.
let apiPromise: Promise<any> | null = null;
function loadYouTubeAPI(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if ((window as any).YT?.Player) return Promise.resolve((window as any).YT);
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

export default function HeroVideo({ youtubeId }: { youtubeId: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    const tick = () => {
      const p = playerRef.current;
      if (p?.getDuration) {
        const d = p.getDuration();
        const t = p.getCurrentTime?.() ?? 0;
        if (d > 3 && t >= d - 2) {
          p.seekTo(0);
          p.playVideo();
        }
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const create = () => {
      loadYouTubeAPI().then((YT) => {
        if (cancelled || !YT || !hostRef.current || playerRef.current) return;
        playerRef.current = new YT.Player(hostRef.current, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1, mute: 1, controls: 0, rel: 0, modestbranding: 1,
            playsinline: 1, disablekb: 1, fs: 0, iv_load_policy: 3,
            loop: 1, playlist: youtubeId,
          },
          events: {
            onReady: (e: any) => { e.target.mute(); e.target.playVideo(); if (visibleRef.current) startLoop(); },
            onStateChange: (e: any) => { if (e.data === 0) { playerRef.current?.seekTo(0); playerRef.current?.playVideo(); } },
          },
        });
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!playerRef.current) create();
          else { playerRef.current.playVideo?.(); startLoop(); }
        } else {
          stopLoop();
          playerRef.current?.pauseVideo?.();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      stopLoop();
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, [youtubeId]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[100vh] min-h-[56.25vw] w-[177.78vh] min-w-[100vw] -translate-x-1/2 -translate-y-1/2 scale-[1.3]">
      <div ref={hostRef} className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
    </div>
  );
}
