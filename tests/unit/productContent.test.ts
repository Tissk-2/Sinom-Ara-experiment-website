import { describe, expect, it } from "vitest";
import {
  buildWhatsappLink,
  INGREDIENTS,
  PROCESS_STEPS,
  PRODUCT_FACTS,
  TASTE_NOTES,
  WHATSAPP_NUMBER,
  whatsappOrderMessage,
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

  it("builds valid WhatsApp order destinations", () => {
    expect(WHATSAPP_NUMBER).toMatch(/^62\d{8,12}$/);
    const link = buildWhatsappLink(whatsappOrderMessage(PRODUCT_SIZES_FIXTURE));
    expect(link).toMatch(/^https:\/\/wa\.me\/62\d{8,12}\?text=/);
    expect(decodeURIComponent(link)).toContain("275 ml");
  });
});

const PRODUCT_SIZES_FIXTURE = {
  size: "275 ml",
  box: "10 pcs / box",
  price: "Rp48.000",
};
