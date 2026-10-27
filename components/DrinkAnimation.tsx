"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useTransform, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";

const FRAME_COUNT = 192;
// Every other frame: halves the payload with no visible loss once the spring
// smooths progress. The last frame is loaded separately so the splash climax
// stays intact.
const FRAME_STEP = 2;
const CONCURRENCY = 8;

/**
 * Progress at which Beat D (the closing CTA) begins to fade in. Kept in sync
 * with the opacityD transform range below.
 */
const CTA_REVEAL_PROGRESS = 0.85;

function frameUrl(index: number) {
  return `/sequence/${String(index + 1).padStart(5, "0")}.webp`;
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function subscribePrefersReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

/**
 * Replaces failed frames with the nearest successfully loaded frame so the
 * array keeps its original length. Dropping the holes instead would shift
 * every later frame earlier and desynchronise the scroll timeline; leaving
 * them empty would render a black canvas.
 */
function fillFrameGaps(
  frames: (HTMLImageElement | undefined)[],
): HTMLImageElement[] {
  const filled: HTMLImageElement[] = [];
  let lastGood: HTMLImageElement | undefined;

  for (const frame of frames) {
    if (frame) lastGood = frame;
    if (lastGood) filled.push(lastGood);
  }

  // If the very first frames failed, backfill them from the first good frame.
  while (filled.length < frames.length && filled.length > 0) {
    filled.unshift(filled[0]);
  }

  return filled;
}

export default function DrinkAnimation() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const staticMode = useSyncExternalStore(
    subscribePrefersReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    void import("motion-components");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadFrames = async () => {
      // Frame 1 doubles as the poster: the hero becomes scrollable as soon as
      // it lands, and the rest of the sequence streams in behind it.
      const poster = await loadImage(frameUrl(0));
      if (cancelled) return;
      if (poster) {
        setImages([poster]);
        setLoaded(true);
      }

      if (staticMode) return;

      const indices: number[] = [];
      for (let i = FRAME_STEP; i < FRAME_COUNT; i += FRAME_STEP) {
        indices.push(i);
      }
      if (indices[indices.length - 1] !== FRAME_COUNT - 1) {
        indices.push(FRAME_COUNT - 1);
      }

      const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
      frames[0] = poster ?? undefined;
      let next = 0;

      const worker = async () => {
        while (next < indices.length && !cancelled) {
          const index = indices[next];
          next += 1;
          const img = await loadImage(frameUrl(index));
          if (cancelled) return;
          if (img) frames[index] = img;
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, indices.length) }, () =>
          worker(),
        ),
      );
      if (cancelled) return;

      const filled = fillFrameGaps(frames);
      if (filled.length === FRAME_COUNT) {
        setImages(filled);
        setLoaded(true);
      }
    };

    void loadFrames();

    return () => {
      cancelled = true;
    };
  }, [staticMode]);

  const skipToIntro = () => {
    document.getElementById("heritage")?.scrollIntoView({ behavior: "auto" });
  };

  if (!loaded) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[var(--bg)] text-white select-none px-6">
        {/* Server-rendered H1: crawlers and link-preview scrapers never execute the
            scroll animation, so this is the only heading they receive. */}
        <h1 className="sr-only">
          Sinom ARA — Sinom khas Jawa dari daun asam muda, kunyit, dan gula aren
        </h1>
        <p
          aria-hidden="true"
          className="text-white/80 tracking-[0.4em] text-xs uppercase motion-safe:animate-pulse"
        >
          Sinom ARA
        </p>
        <button
          type="button"
          onClick={skipToIntro}
          className="mt-10 min-h-11 px-6 py-3 border border-white/30 text-white/80 hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] transition-colors duration-300 tracking-[0.2em] text-[11px] uppercase"
        >
          Lewati Intro
        </button>
      </div>
    );
  }

  return <AnimationSequence images={images} staticMode={staticMode} />;
}

function AnimationSequence({
  images,
  staticMode = false,
}: {
  images: HTMLImageElement[];
  staticMode?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawProgress = useMotionValue(0);
  const [ctaReachable, setCtaReachable] = useState(false);

  // Responsive spring physics: swift, effortless feel with smooth deceleration
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.35,
  });

  useEffect(() => {
    if (staticMode) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = containerHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      // Remove Math.min(1, ...) so progress can continue past 1.0 while LandingContent slides over
      const progress = Math.max(0, scrolled / scrollableDistance);
      rawProgress.set(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rawProgress, staticMode]);

  const renderFrame = (progressValue: number) => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas backing size is managed by the resize effect; reading it here
    // avoids resetting the context (and losing cleared state) on every tick.
    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;

    // The animation reaches its full splash climax (frame 192) at progress = 1.25 (where only the top splash is visible)
    const animationProgress = Math.min(1, progressValue / 1.25);
    const frameIndex = Math.min(
      images.length - 1,
      Math.max(0, Math.round(animationProgress * (images.length - 1)))
    );

    const img = images[frameIndex];
    if (!img) return;
    if (!(img.complete && img.naturalWidth > 0)) return;

    // Cover the viewport at every aspect ratio. The old portrait branch
    // scaled to fit, which letterboxed a 16:9 frame into ~260px black bars.
    const scale = Math.max(w / img.width, h / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const offsetX = (w - drawW) / 2;
    const offsetY = (h - drawH) / 2;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeCanvas = () => {
      // Render at the device pixel ratio (capped at 2) so the canvas is sharp
      // on phones instead of being upscaled by the compositor.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(window.innerWidth * dpr);
      const height = Math.round(window.innerHeight * dpr);
      if (canvas.width === width && canvas.height === height) return;
      // Assigning width/height resets the 2D context, so only do it when the
      // viewport actually changed instead of on every animation tick.
      canvas.width = width;
      canvas.height = height;
    };

    const handleResize = () => {
      sizeCanvas();
      renderFrame(smoothProgress.get());
    };

    sizeCanvas();
    // Repaint whenever a new image array arrives (poster -> full sequence) or
    // the viewport changes; otherwise the canvas would keep the old frame.
    renderFrame(smoothProgress.get());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, smoothProgress]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    renderFrame(latest);
    // Beat D starts fading in at 0.85; until then its CTA is invisible, so it
    // must not be clickable or reachable by keyboard.
    setCtaReachable(latest >= CTA_REVEAL_PROGRESS);
  });

  // Beat A: Opening (Hold 0–16%, completely fade out by 22%)
  const opacityA = useTransform(smoothProgress, [0, 0.16, 0.22], [1, 1, 0]);
  const yA = useTransform(smoothProgress, [0, 0.16, 0.22], [0, 0, -25]);

  // Beat B: Ingredients (The Roots) (Fade in 25–30%, Hold 30–42%, completely fade out by 48%)
  const opacityB = useTransform(smoothProgress, [0.25, 0.30, 0.42, 0.48], [0, 1, 1, 0]);
  const yB = useTransform(smoothProgress, [0.25, 0.30, 0.42, 0.48], [25, 0, 0, -25]);

  // Beat C: Character (The Balance) (Fade in 55–60%, Hold 60–72%, completely fade out by 78%)
  const opacityC = useTransform(smoothProgress, [0.55, 0.60, 0.72, 0.78], [0, 1, 1, 0]);
  const yC = useTransform(smoothProgress, [0.55, 0.60, 0.72, 0.78], [25, 0, 0, -25]);

  // Beat D: Closing & CTA (Fade in 85–92%, Hold around 1.0, fade out as white page covers)
  const opacityD = useTransform(smoothProgress, [0.85, 0.92, 1.0, 1.12], [0, 1, 1, 0]);
  const yD = useTransform(smoothProgress, [0.85, 0.92, 1.0, 1.12], [25, 0, 0, -25]);

  const indicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: staticMode ? "100vh" : "400vh" }}
    >
      {/* 100vh continuous snap segments for effortless, brisk scrolling */}
      {!staticMode && (
        <>
          <div className="snap-point absolute top-0 w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />
          <div className="snap-point absolute top-[100vh] w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />
          <div className="snap-point absolute top-[200vh] w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />
          <div className="snap-point absolute top-[300vh] w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />
        </>
      )}

      <div className="fixed top-0 left-0 min-h-[100dvh] w-full overflow-hidden bg-[var(--bg)] z-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/70"
        >
          <span className="text-[11px] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-8 md:h-10 bg-gradient-to-b from-white/70 to-transparent" />
        </motion.div>

        {/* Beat A — Title */}
        <motion.div
          style={{ opacity: opacityA, y: yA }}
          className="hero-copy-shadow absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl text-white/90 font-light tracking-tight mb-4 md:mb-6 text-center leading-[1.1]">
            SINOM ARA
          </h1>
          <p className="text-base md:text-lg text-white/70 font-light tracking-wide text-center">
            Tradition in every sip.
          </p>
        </motion.div>

        {/* Beat B — Ingredients, left-aligned */}
        <motion.div
          style={{ opacity: opacityB, y: yB }}
          className="hero-copy-shadow absolute inset-0 flex flex-col justify-center pointer-events-none px-6 md:px-16 lg:px-32"
        >
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white/90 font-light tracking-tight mb-4 leading-[1.1]">
              THE ROOTS
            </h2>
            <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-[50ch]">
              Daun asam muda, kunyit, dan gula aren — diseduh perlahan dari resep warisan generasi Malang.
            </p>
          </div>
        </motion.div>

        {/* Beat C — Character, right-aligned */}
        <motion.div
          style={{ opacity: opacityC, y: yC }}
          className="hero-copy-shadow absolute inset-0 flex flex-col justify-center items-end pointer-events-none px-6 md:px-16 lg:px-32"
        >
          <div className="max-w-lg text-right">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white/90 font-light tracking-tight mb-4 leading-[1.1]">
              THE BALANCE
            </h2>
            <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-[50ch] ml-auto">
              Manis, asam, dan hangat. Menyegarkan di hari yang panas, dan cukup menenangkan untuk menemanimu.
            </p>
          </div>
        </motion.div>

        {/* Beat D — CTA. Hidden from interaction and assistive technology until
            the beat has actually faded in; opacity alone would leave an
            invisible, focusable link in the middle of the hero. */}
        <motion.div
          style={{ opacity: opacityD, y: yD }}
          className="hero-copy-shadow absolute inset-0 flex flex-col items-center justify-center px-6"
          aria-hidden={!ctaReachable}
          inert={!ctaReachable}
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl text-white/90 font-light tracking-tight mb-8 text-center leading-[1.1]">
            GET YOURS
          </h2>
          <motion-magnetic>
            <a
              href="#order"
              tabIndex={ctaReachable ? undefined : -1}
              className="hero-cta"
            >
              Pesan Sekarang
            </a>
          </motion-magnetic>
        </motion.div>
      </div>
    </div>
  );
}
