import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  INGREDIENTS,
  PRODUCT_FACTS,
  WHATSAPP_NUMBER,
} from "@/components/product/productContent";

// PRODUCT.md documents the same ordering and contact facts the site renders.
// This keeps the prose honest: if either side changes, the suite fails instead
// of quietly letting the spec and the live page disagree.
const spec = readFileSync(join(process.cwd(), "PRODUCT.md"), "utf8");

describe("PRODUCT.md matches the rendered product content", () => {
  it("names the same WhatsApp ordering channel", () => {
    expect(spec).toContain(`wa.me/${WHATSAPP_NUMBER}`);
  });

  it("names the same Instagram destination", () => {
    expect(spec).toContain(PRODUCT_FACTS.instagramUrl);
  });

  it("lists the same three ingredients", () => {
    const lowerSpec = spec.toLowerCase();
    for (const { name } of INGREDIENTS) {
      expect(lowerSpec).toContain(name.toLowerCase());
    }
  });
});
