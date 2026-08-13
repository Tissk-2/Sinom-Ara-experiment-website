"use client";

import { useEffect } from "react";

export default function LandingContent() {
  useEffect(() => {
    import("motion-components/motion-reveal");
    import("motion-components/motion-stagger");
  }, []);

  return (
    <>
      {/* ─── Heritage ─── */}
      <section id="heritage" className="bg-[var(--bg)] py-28 md:py-44 px-6 md:px-16 lg:px-32">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 md:gap-20">
          {/* Left — headline spans 2 cols */}
          <div className="md:col-span-2">
            <motion-reveal>
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--fg)]/90 font-light tracking-tight leading-[1.15] sticky top-32">
                Brewed in Malang, rooted in tradition.
              </h2>
            </motion-reveal>
          </div>

          {/* Right — body text spans 3 cols */}
          <div className="md:col-span-3 space-y-6">
            <motion-reveal>
              <p className="text-sm md:text-base text-[var(--muted)] font-light leading-relaxed max-w-[60ch]">
                Sinom is a traditional Javanese herbal drink made from young tamarind leaves, turmeric, and a careful blend of natural spices. Families across East Java have brewed it for generations — valued both for its bright, tangy flavour and for its role in supporting digestion.
              </p>
            </motion-reveal>
            <motion-reveal>
              <p className="text-sm md:text-base text-[var(--muted)] font-light leading-relaxed max-w-[60ch]">
                At ARA, every bottle is slow-brewed in small batches using only fresh, locally sourced ingredients. No artificial preservatives. No shortcuts.
              </p>
            </motion-reveal>
          </div>
        </div>
      </section>

      {/* Thin divider */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 lg:px-32">
        <div className="h-px bg-[var(--border)]" />
      </div>

      {/* ─── Ingredients — full-width stagger grid ─── */}
      <section className="bg-[var(--bg)] py-28 md:py-44 px-6 md:px-16 lg:px-32">
        <div className="max-w-5xl mx-auto">
          <motion-reveal>
            <p className="text-[var(--accent)] tracking-[0.3em] uppercase text-[11px] mb-4">
              What goes in
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--fg)]/90 font-light tracking-tight mb-20 md:mb-28 leading-[1.15]">
              Three ingredients. Nothing else.
            </h2>
          </motion-reveal>

          <motion-stagger interval="0.15">
            <div className="grid md:grid-cols-3 gap-px bg-[var(--border)]">
              {/* Ingredient 1 */}
              <div className="bg-[var(--bg)] p-8 md:p-10">
                <span className="text-[var(--accent)]/60 text-[11px] tracking-[0.2em] uppercase block mb-6">01</span>
                <h3 className="text-lg md:text-xl text-[var(--fg)]/90 font-light tracking-tight mb-3">
                  Young Tamarind Leaves
                </h3>
                <p className="text-sm text-[var(--muted)] font-light leading-relaxed">
                  Hand-picked for their delicate sourness. Rich in antioxidants and vitamin C — the source of Sinom&apos;s signature tangy bite.
                </p>
              </div>

              {/* Ingredient 2 */}
              <div className="bg-[var(--bg)] p-8 md:p-10">
                <span className="text-[var(--accent)]/60 text-[11px] tracking-[0.2em] uppercase block mb-6">02</span>
                <h3 className="text-lg md:text-xl text-[var(--fg)]/90 font-light tracking-tight mb-3">
                  Fresh Turmeric
                </h3>
                <p className="text-sm text-[var(--muted)] font-light leading-relaxed">
                  Adds warm, earthy depth and a golden colour. Known for its anti-inflammatory properties and digestive support.
                </p>
              </div>

              {/* Ingredient 3 */}
              <div className="bg-[var(--bg)] p-8 md:p-10">
                <span className="text-[var(--accent)]/60 text-[11px] tracking-[0.2em] uppercase block mb-6">03</span>
                <h3 className="text-lg md:text-xl text-[var(--fg)]/90 font-light tracking-tight mb-3">
                  Palm Sugar
                </h3>
                <p className="text-sm text-[var(--muted)] font-light leading-relaxed">
                  Naturally sweetened for a smooth, caramel-like finish. Lower glycemic index than refined sugar.
                </p>
              </div>
            </div>
          </motion-stagger>
        </div>
      </section>

      {/* ─── CTA — centered, minimal ─── */}
      <section id="order" className="bg-[var(--bg)] py-28 md:py-44 px-6 md:px-16 lg:px-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion-reveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--fg)]/90 font-light tracking-tight mb-6 leading-[1.15]">
              Ready to try it?
            </h2>
          </motion-reveal>
          <motion-reveal>
            <p className="text-sm md:text-base text-[var(--muted)] font-light leading-relaxed mb-12 max-w-md mx-auto">
              Order through our Instagram. Fresh batches brewed weekly in Malang.
            </p>
          </motion-reveal>
          <motion-reveal>
            <a 
              href="https://www.instagram.com/sinomaramalang/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-dim)] transition-colors duration-300 tracking-[0.2em] text-xs uppercase font-medium"
            >
              Order on Instagram
            </a>
          </motion-reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[var(--bg)] border-t border-[var(--border)] py-12 md:py-16 px-6 md:px-16 lg:px-32">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-sm text-[var(--fg)]/80 font-light tracking-tight mb-1">
              Sinom ARA
            </p>
            <p className="text-xs text-[var(--muted)]">
              Malang, East Java · Indonesia
            </p>
          </div>

          <div className="flex gap-8">
            <a 
              href="https://www.instagram.com/sinomaramalang/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors duration-300 tracking-[0.15em] uppercase"
            >
              Instagram
            </a>
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors duration-300 tracking-[0.15em] uppercase"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--muted)]/50 tracking-[0.15em]">
            &copy; {new Date().getFullYear()} Sinom ARA
          </p>
        </div>
      </footer>
    </>
  );
}
