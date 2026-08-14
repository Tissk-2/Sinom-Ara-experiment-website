"use client";

import { useEffect } from "react";
import ProductSections from "./product/ProductSections";

export default function LandingContent() {
  useEffect(() => {
    void import("motion-components");
  }, []);

  return <ProductSections />;
}
