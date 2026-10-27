"use client";

export default function SkipLink() {
  return (
    <a
      className="skip-link"
      href="#produk"
      onClick={(event) => {
        const target = document.getElementById("produk");
        if (!target) return;
        event.preventDefault();
        // The hero owns 400vh of scroll; a smooth skip would animate through
        // all of it, so jump straight to the products and move focus there.
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "instant" });
        target.focus({ preventScroll: true });
        history.pushState(null, "", "#produk");
      }}
    >
      Lewati ke produk
    </a>
  );
}
