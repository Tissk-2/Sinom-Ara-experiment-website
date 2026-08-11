"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent, useMotionValue } from "framer-motion";

const FRAME_COUNT = 192;

export default function DrinkAnimation() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    const preloadImages = async () => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const filename = String(i + 1).padStart(5, '0') + '.jpg';
        img.src = `/sequence/${filename}`; 
        await new Promise((resolve) => {
          img.onload = () => {
            loadedCount++;
            setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
            resolve(null);
          };
          img.onerror = () => resolve(null); // Continue even if one fails
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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white">
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out" 
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-white/60 tracking-widest text-sm uppercase">Curating {loadingProgress}%</p>
      </div>
    );
  }

  return <AnimationSequence images={images} />;
}

function AnimationSequence({ images }: { images: HTMLImageElement[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Manual scroll progress to guarantee it works regardless of Next.js/Framer quirks
  const rawProgress = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate based on the entire document to guarantee it reaches exactly 1.0 at the bottom
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (maxScroll <= 0) return;
      
      // Ensure progress is clamped precisely between 0 and 1
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      
      rawProgress.set(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rawProgress]);



  const renderFrame = (progress: number) => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Complete the animation at 90% scroll so they don't have to hit the pixel-perfect bottom
    const animationProgress = Math.min(1, progress / 0.9);
    
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(animationProgress * (FRAME_COUNT - 1)))
    );

    const img = images[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
      // "cover" fit logic for immersive full-screen on all devices
      const scale = Math.max(w / img.width, h / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const offsetX = (w - drawW) / 2;
      const offsetY = (h - drawH) / 2;
      
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }
  };

  // Initial render and resize handler
  useEffect(() => {
    renderFrame(rawProgress.get());
    
    const handleResize = () => renderFrame(rawProgress.get());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, rawProgress]);

  useMotionValueEvent(rawProgress, "change", (latest) => {
    renderFrame(latest);
  });

  // Scrollytelling Beats
  // Beat A (0–20% Scroll)
  const opacityA = useTransform(rawProgress, [0, 0.1, 0.15, 0.25], [1, 1, 1, 0]);
  const yA = useTransform(rawProgress, [0, 0.1, 0.15, 0.25], [0, 0, 0, -20]);

  // Beat B (25–45% Scroll)
  const opacityB = useTransform(rawProgress, [0.25, 0.35, 0.4, 0.5], [0, 1, 1, 0]);
  const yB = useTransform(rawProgress, [0.25, 0.35, 0.4, 0.5], [20, 0, 0, -20]);

  // Beat C (50–70% Scroll)
  const opacityC = useTransform(rawProgress, [0.5, 0.6, 0.65, 0.75], [0, 1, 1, 0]);
  const yC = useTransform(rawProgress, [0.5, 0.6, 0.65, 0.75], [20, 0, 0, -20]);

  // Beat D (75–100% Scroll)
  const opacityD = useTransform(rawProgress, [0.75, 0.85, 1], [0, 1, 1]);
  const yD = useTransform(rawProgress, [0.75, 0.85, 1], [20, 0, 0]);

  const indicatorOpacity = useTransform(rawProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "400vh" }}>
      <div className="fixed inset-0 h-screen w-full overflow-hidden bg-[#050505]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs md:text-sm tracking-widest uppercase whitespace-nowrap">Scroll to Explore</span>
          <div className="w-px h-8 md:h-12 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>

        {/* Text Overlays */}
        <motion.div 
          style={{ opacity: opacityA, y: yA }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <h1 className="text-4xl md:text-7xl lg:text-9xl text-white/90 font-light tracking-tight mb-4 md:mb-6 text-center">
            THE PERFECT POUR
          </h1>
          <p className="text-lg md:text-2xl text-white/60 font-light tracking-wide text-center">
            How to serve it right.
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: opacityB, y: yB }}
          className="absolute inset-0 flex flex-col justify-center pointer-events-none px-6 md:px-16 lg:px-32"
        >
          <div className="max-w-xl text-left">
            <h2 className="text-3xl md:text-5xl lg:text-7xl text-white/90 font-light tracking-tight mb-4">
              THE FOUNDATION
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/60 font-light tracking-wide leading-relaxed">
              Made with filtered water and aged in charred oak barrels to balance the flavor.
            </p>
          </div>
        </motion.div>

        <motion.div 
          style={{ opacity: opacityC, y: yC }}
          className="absolute inset-0 flex flex-col justify-center items-end pointer-events-none px-6 md:px-16 lg:px-32"
        >
          <div className="max-w-xl text-right">
            <h2 className="text-3xl md:text-5xl lg:text-7xl text-white/90 font-light tracking-tight mb-4">
              THE INFUSION
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/60 font-light tracking-wide leading-relaxed">
              Flavored with botanicals. You can taste dark chocolate, vanilla, and smoked citrus.
            </p>
          </div>
        </motion.div>

        <motion.div 
          style={{ opacity: opacityD, y: yD }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <h2 className="text-4xl md:text-6xl lg:text-8xl text-white/90 font-light tracking-tight mb-6 md:mb-8 text-center">
            FIND A BOTTLE
          </h2>
          <button className="px-6 py-3 md:px-8 md:py-4 border border-white/30 text-white hover:bg-white hover:text-[#050505] transition-all duration-300 tracking-widest text-sm md:text-base uppercase pointer-events-auto">
            Discover More
          </button>
        </motion.div>
      </div>
    </div>
  );
}
