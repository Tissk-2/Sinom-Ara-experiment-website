"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";

const FRAME_COUNT = 192;

export default function DrinkAnimation() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    import("motion-components");
  }, []);

  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    const preloadImages = async () => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const filename = String(i + 1).padStart(5, '0') + '.webp';
        img.src = `/sequence/${filename}`; 
        await new Promise((resolve) => {
          img.onload = () => {
            loadedCount++;
            setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
            resolve(null);
          };
          img.onerror = () => resolve(null);
        });
        imgArray.push(img);
      }
      setImages(imgArray);
      setLoaded(true);
    };

    preloadImages();
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[var(--bg)] text-white select-none">
        <div className="w-48 h-px bg-white/20 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out" 
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-white/70 tracking-[0.25em] text-[11px] uppercase mb-2">
          Loading {loadingProgress}%
        </p>
        <p className="text-white/40 tracking-[0.18em] text-[10px] uppercase font-light">
          Please wait for the loading to finish
        </p>
      </div>
    );
  }

  return <AnimationSequence images={images} />;
}

function AnimationSequence({ images }: { images: HTMLImageElement[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawProgress = useMotionValue(0);

  // Responsive spring physics: swift, effortless feel with smooth deceleration
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.35,
  });

  useEffect(() => {
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
  }, [rawProgress]);

  const renderFrame = (progressValue: number) => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // The animation reaches its full splash climax (frame 192) at progress = 1.25 (where only the top splash is visible)
    const animationProgress = Math.min(1, progressValue / 1.25);
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(animationProgress * (FRAME_COUNT - 1)))
    );

    const img = images[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.max(w / img.width, h / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const offsetX = (w - drawW) / 2;
      const offsetY = (h - drawH) / 2;
      
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }
  };

  useEffect(() => {
    renderFrame(smoothProgress.get());
    const handleResize = () => renderFrame(smoothProgress.get());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, smoothProgress]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    renderFrame(latest);
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
    <div ref={containerRef} className="relative w-full" style={{ height: "400vh" }}>
      {/* 100vh continuous snap segments for effortless, brisk scrolling */}
      <div className="snap-point absolute top-0 w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />
      <div className="snap-point absolute top-[100vh] w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />
      <div className="snap-point absolute top-[200vh] w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />
      <div className="snap-point absolute top-[300vh] w-full pointer-events-none" style={{ height: "100vh" }} aria-hidden="true" />

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
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
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
          className="absolute inset-0 flex flex-col justify-center pointer-events-none px-6 md:px-16 lg:px-32"
        >
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white/90 font-light tracking-tight mb-4 leading-[1.1]">
              THE ROOTS
            </h2>
            <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-[50ch]">
              Young tamarind leaves, turmeric, and palm sugar — slow-brewed using a recipe passed down through generations in Malang.
            </p>
          </div>
        </motion.div>

        {/* Beat C — Character, right-aligned */}
        <motion.div 
          style={{ opacity: opacityC, y: yC }}
          className="absolute inset-0 flex flex-col justify-center items-end pointer-events-none px-6 md:px-16 lg:px-32"
        >
          <div className="max-w-lg text-right">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white/90 font-light tracking-tight mb-4 leading-[1.1]">
              THE BALANCE
            </h2>
            <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-[50ch] ml-auto">
              Sweet, sour, and earthy. Refreshing on a hot day, grounding enough to stay with you.
            </p>
          </div>
        </motion.div>

        {/* Beat D — CTA */}
        <motion.div 
          style={{ opacity: opacityD, y: yD }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl text-white/90 font-light tracking-tight mb-8 text-center leading-[1.1]">
            GET YOURS
          </h2>
          <motion-magnetic>
            <a 
              href="#order" 
              className="px-8 py-4 border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300 tracking-[0.2em] text-xs uppercase pointer-events-auto"
            >
              Order Now
            </a>
          </motion-magnetic>
        </motion.div>
      </div>
    </div>
  );
}
