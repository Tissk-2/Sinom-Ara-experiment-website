"use client";

import { useEffect, useState } from "react";
import { buildWhatsappLink, ORDER_MESSAGE } from "./productContent";
import styles from "./StickyOrderBar.module.css";

export default function StickyOrderBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const heritage = document.getElementById("heritage");
    const order = document.getElementById("order");
    if (!heritage || !order) return;

    let frame = 0;

    // A scroll-position check rather than an IntersectionObserver: anchor
    // jumps and restored scroll positions can move an observed section from
    // "below the viewport" to "above it" without ever intersecting, which
    // leaves IO silent and the bar stuck hidden.
    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.9;
      const reachedStory = heritage.getBoundingClientRect().top < threshold;
      const reachedOrder = order.getBoundingClientRect().top < threshold;
      // The bar is only useful between the end of the hero and the order
      // section; once the closing CTA has been seen it would just cover the
      // footer.
      setVisible(reachedStory && !reachedOrder);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`${styles.bar} ${visible ? styles.barVisible : ""}`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <a
        href={buildWhatsappLink(ORDER_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
        tabIndex={visible ? undefined : -1}
      >
        Pesan via WhatsApp
      </a>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className={styles.close}
        aria-label="Tutup bilah pesan"
        tabIndex={visible ? undefined : -1}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
