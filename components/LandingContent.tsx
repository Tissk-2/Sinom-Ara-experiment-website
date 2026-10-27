"use client";

import { useEffect } from "react";
import ProductSections from "./product/ProductSections";
import StickyOrderBar from "./product/StickyOrderBar";

export default function LandingContent() {
  useEffect(() => {
    void import("motion-components");
  }, []);

  return (
    <>
      <ProductSections />
      <StickyOrderBar />
    </>
  );
}
