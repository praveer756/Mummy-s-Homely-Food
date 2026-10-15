"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowDown,
  Eye,
  RotateCcw,
  Sparkles,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";

interface Hero3DCanvasProps {
  onExploreMenu: () => void;
  onOpenTableModal: () => void;
  onLoadProgress?: (progress: number) => void;
  onModelReady?: () => void;
}

const TOTAL_FRAMES = 14;
const SCROLL_HEIGHT_VH = 300;
const LERP_FACTOR = 0.08; // 0.04 = very cinematic/slow, 0.15 = snappy

// Build the image path array: /images/frames/1.webp … /images/frames/14.webp
const FRAME_PATHS = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/images/frames/${i + 1}.webp`
);

export default function Hero3DCanvas({
  onExploreMenu,
  onOpenTableModal,
  onLoadProgress,
  onModelReady,
}: Hero3DCanvasProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  // All 14 decoded Image objects live here once preloaded
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);

  const rawProgress = useRef(0);
  const smoothProgress = useRef(0);
  const lastDrawnFrame = useRef(-1);

  const [mounted, setMounted] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const readyNotified = useRef(false);
  const progressCb = useRef(onLoadProgress);
  const readyCb = useRef(onModelReady);
  progressCb.current = onLoadProgress;
  readyCb.current = onModelReady;

  // Mount delay — matches your original 900 ms
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  // ── Draw a specific frame index onto the canvas ──────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cover-fit: fill canvas, center-crop like CSS object-fit:cover
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth  || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // ── Resize canvas to fill the sticky panel ───────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const outer = outerRef.current;
    if (!canvas || !outer) return;
    const panel = outer.querySelector(".sticky-panel") as HTMLElement | null;
    const w = panel ? panel.clientWidth  : window.innerWidth;
    const h = panel ? panel.clientHeight : window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
      // Redraw current frame after resize
      const fi = Math.round(smoothProgress.current * (TOTAL_FRAMES - 1));
      drawFrame(Math.max(0, Math.min(TOTAL_FRAMES - 1, fi)));
    }
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  // ── Preload all 14 frames in parallel ────────────────────────
  useEffect(() => {
    framesRef.current = new Array(TOTAL_FRAMES).fill(null);
    loadedCountRef.current = 0;

    FRAME_PATHS.forEach((src, i) => {
      const img = new window.Image();
      img.decoding = "async";

      img.onload = () => {
        framesRef.current[i] = img;
        loadedCountRef.current += 1;
        setLoadedCount(loadedCountRef.current);

        const pct = Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100);
        progressCb.current?.(pct);

        // Show frame 1 as soon as it's available so there's no black flash
        if (i === 0) {
          resizeCanvas();
          drawFrame(0);
        }

        if (loadedCountRef.current === TOTAL_FRAMES) {
          setFramesReady(true);
        }
      };

      img.onerror = () => {
        // Count failures too so the preloader doesn't stall
        loadedCountRef.current += 1;
        if (loadedCountRef.current === TOTAL_FRAMES) {
          setFramesReady(true);
        }
      };

      img.src = src;
    });
  }, [drawFrame, resizeCanvas]);

  // Notify parent when all frames are ready
  useEffect(() => {
    if (!framesReady || readyNotified.current) return;
    readyNotified.current = true;
    progressCb.current?.(100);
    readyCb.current?.();
  }, [framesReady]);

  // ── Main rAF loop: scroll → smooth progress → draw frame ─────
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const outer = outerRef.current;
      if (!outer) return;

      // getBoundingClientRect works correctly even inside overflow:hidden parents
      const rect = outer.getBoundingClientRect();
      const totalScroll =
        (SCROLL_HEIGHT_VH / 100) * window.innerHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1, -rect.top / totalScroll));
      rawProgress.current = raw;

      // Lerp for cinematic smoothness
      smoothProgress.current +=
        (raw - smoothProgress.current) * LERP_FACTOR;

      // Map 0→1 progress to 0→13 frame index
      const frameIndex = Math.round(
        smoothProgress.current * (TOTAL_FRAMES - 1)
      );
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));

      // Only redraw if the frame actually changed — no wasted draws
      if (clamped !== lastDrawnFrame.current && framesRef.current[clamped]) {
        lastDrawnFrame.current = clamped;
        drawFrame(clamped);
      }

      // Update React state for captions (cheap — coarse bucket)
      const bucket = Math.round(raw * 100);
      setScrollProgress((prev) => {
        const prevBucket = Math.round(prev * 100);
        return bucket !== prevBucket ? raw : prev;
      });
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  // Derived display values
  const stage = Math.min(3, Math.floor(scrollProgress * 4)) as 0 | 1 | 2 | 3;
  const isArrived   = scrollProgress >= 0.97;
  const introVisible = scrollProgress < 0.12;
  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div
      ref={outerRef}
      id="hero"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      className="relative w-full"
    >
      <div className="sticky-panel sticky top-0 isolate flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#160c08] text-[#FFF9EF]">

        {/* ── Canvas: all 14 frames are drawn here ─────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[1] h-full w-full"
        />

        {/* ── Loading overlay: shows until all 14 frames decoded ── */}
        {!framesReady && (
          <div className="absolute inset-0 z-[25] flex flex-col items-center justify-center gap-4 bg-[#160c08]">
            <div className="h-12 w-12 rounded-full border-2 border-amber-200/20 border-t-amber-300 animate-spin" />
            <p className="text-xs tracking-widest text-amber-200/60 uppercase">
              Loading · {loadPct}%
            </p>
            {/* Thin progress bar */}
            <div className="w-48 h-[2px] rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E6A72E] to-[#FFD071] transition-all duration-300"
                style={{ width: `${loadPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Cinematic grade + vignette — identical to your original */}
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(180deg,rgba(12,7,5,.30)_0%,rgba(15,8,5,.04)_42%,rgba(20,9,5,.62)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(10,5,3,.38)_100%)]" />
        <div className="pointer-events-none absolute left-[24%] top-[35%] z-[4] h-44 w-72 rounded-full bg-red-600/15 blur-[90px]" />
        <div className="pointer-events-none absolute right-[17%] top-[39%] z-[4] h-48 w-64 rounded-full bg-amber-300/15 blur-[95px]" />

        {/* ── Top nav ──────────────────────────────────────────── */}
        <div
          className={`relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 pt-24 transition-all duration-1000 sm:px-8 sm:pt-28 ${
            mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DFCA9B]/40 bg-black/55 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#FFF3D9] backdrop-blur-md sm:text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {isArrived
              ? "You've arrived · Welcome in"
              : "Maharashtrian food · Roadside warmth"}
          </div>
          <button
            onClick={onOpenTableModal}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200/45 bg-black/60 px-3.5 py-2 text-xs font-medium text-amber-100 backdrop-blur-md transition hover:bg-amber-300/15 sm:px-4"
          >
            <UtensilsCrossed size={14} />
            <span>Table inquiry</span>
          </button>
        </div>

        {/* ── Opening copy ─────────────────────────────────────── */}
        <div
          className={`relative z-10 mx-4 mb-7 mt-auto max-w-xl transition-all duration-700 sm:mx-8 sm:mb-10 ${
            introVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0 pointer-events-none"
          }`}
        >
          <div className="rounded-2xl border border-[#DFCA9B]/30 bg-[#1b100b]/75 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#F7D99B] sm:text-xs">
              <Sparkles size={13} />
              Made with love · Served with warmth
            </p>
            <h1
              className="text-3xl font-bold leading-tight text-[#FFF9EF] drop-shadow-lg sm:text-4xl"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Mummy&apos;s Homely Food
            </h1>
            <p className="mt-1 font-marathi text-sm text-[#FFF0D8] sm:text-base">
              आईच्या हातची माया, गावरान मातीची चव.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  document
                    .getElementById("experience")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E6A72E] to-[#FFD071] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#291812] transition hover:-translate-y-0.5"
              >
                <Eye size={15} />
                Step inside
              </button>
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
              >
                <Utensils size={14} className="text-amber-300" />
                Explore menu
              </button>
            </div>
          </div>
        </div>

        {/* ── Journey captions ─────────────────────────────────── */}
        <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 w-[min(90%,560px)] -translate-x-1/2 text-center sm:bottom-9">
          {stage === 1 && scrollProgress < 0.5 && (
            <p className="inline-block rounded-full border border-white/20 bg-black/60 px-5 py-2 text-xs tracking-wide text-white/95 backdrop-blur-md">
              Coming closer · Entering the restaurant
            </p>
          )}
          {stage === 2 && (
            <p className="inline-block rounded-full border border-white/20 bg-black/60 px-5 py-2 text-xs tracking-wide text-white/95 backdrop-blur-md">
              Come in… a place is waiting for you
            </p>
          )}
          {stage === 3 && !isArrived && (
            <p className="inline-block rounded-full border border-white/20 bg-black/60 px-5 py-2 text-xs tracking-wide text-white/95 backdrop-blur-md">
              Finding your table…
            </p>
          )}
          {isArrived && (
            <div className="pointer-events-auto inline-flex flex-col items-center gap-3">
              <p className="rounded-full border border-amber-200/35 bg-black/65 px-5 py-2 text-sm font-semibold tracking-wide text-amber-100 backdrop-blur-md">
                Your table is ready. Welcome home.
              </p>
              <button
                onClick={() =>
                  outerRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:border-amber-200/70 hover:text-amber-100"
              >
                <RotateCcw size={14} />
                Replay the journey
              </button>
            </div>
          )}
        </div>

        {/* ── Scroll progress bar ──────────────────────────────── */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-[2px] w-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#E6A72E] to-[#FFD071]"
            style={{ width: `${scrollProgress * 100}%`, transition: "none" }}
          />
        </div>

        {/* ── Scroll hint ──────────────────────────────────────── */}
        {scrollProgress < 0.02 && (
          <button
            aria-label="Scroll to begin the journey"
            onClick={() =>
              window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" })
            }
            className="absolute bottom-4 right-5 z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-amber-200/40 bg-black/40 text-amber-100 backdrop-blur sm:flex"
          >
            <ArrowDown size={16} />
          </button>
        )}
      </div>
    </div>
  );
}