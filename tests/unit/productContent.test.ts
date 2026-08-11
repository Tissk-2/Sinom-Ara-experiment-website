import { describe, expect, it } from "vitest";
import {
  INGREDIENTS,
  PROCESS_STEPS,
  PRODUCT_FACTS,
  TASTE_NOTES,
} from "@/components/product/productContent";

describe("verified Sinom ARA content", () => {
  it("contains exactly the verified ingredients", () => {
    expect(INGREDIENTS.map(({ name }) => name)).toEqual([
      "Young tamarind leaves",
      "Fresh turmeric",
      "Palm sugar",
    ]);
  });

  it("uses the verified Instagram destination", () => {
    expect(PRODUCT_FACTS.instagramUrl).toBe(
      "https://www.instagram.com/sinomaramalang/",
    );
  });

  it("contains the approved taste and process vocabulary", () => {
    expect(TASTE_NOTES).toEqual(["Bright", "Earthy", "Rounded"]);
    expect(PROCESS_STEPS.map(({ title }) => title)).toEqual([
      "Fresh ingredients",
      "Small batches",
      "Brewed weekly",
    ]);
  });

  it("contains no unsupported health language", () => {
    const copy = JSON.stringify({
      PRODUCT_FACTS,
      INGREDIENTS,
      PROCESS_STEPS,
      TASTE_NOTES,
    });
    expect(copy).not.toMatch(
      /antioxid|vitamin|anti-inflammatory|digestive|glycemic|cure|heal/i,
    );
  });
});
