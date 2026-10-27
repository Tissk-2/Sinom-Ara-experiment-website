import { describe, expect, it } from "vitest";
import {
  buildWhatsappLink,
  INGREDIENTS,
  PROCESS_STEPS,
  PRODUCT_FACTS,
  RESELLER_INFO,
  TASTE_NOTES,
  WHATSAPP_NUMBER,
  whatsappOrderMessage,
} from "@/components/product/productContent";

const HEALTH_CLAIM_PATTERN =
  /antioxid|vitamin|anti-inflammatory|digestive|glycemic|cure|heal/i;

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
      RESELLER_INFO,
    });
    expect(copy).not.toMatch(HEALTH_CLAIM_PATTERN);
  });

  it("builds valid WhatsApp order destinations", () => {
    expect(WHATSAPP_NUMBER).toMatch(/^62\d{8,12}$/);
    const link = buildWhatsappLink(whatsappOrderMessage(PRODUCT_SIZES_FIXTURE));
    expect(link).toMatch(/^https:\/\/wa\.me\/62\d{8,12}\?text=/);
    expect(decodeURIComponent(link)).toContain("275 ml");
  });

  it("routes the reseller enquiry through the same WhatsApp channel", () => {
    const link = buildWhatsappLink(RESELLER_INFO.ctaMessage);
    expect(link).toMatch(/^https:\/\/wa\.me\/62\d{8,12}\?text=/);
    expect(decodeURIComponent(link)).toContain("reseller");
    expect(RESELLER_INFO.image).toMatch(/^\/images\/.+\.jpg$/);
    expect(RESELLER_INFO.ctaLabel).toBe("Tanya Program Reseller");
  });

  it("keeps the restored ingredient section copy intact", () => {
    expect(PRODUCT_FACTS.ingredientEyebrow).toBe("What goes in");
    expect(PRODUCT_FACTS.ingredientHeading).toBe("Three ingredients, held in balance.");
    expect(PRODUCT_FACTS.ingredientBody).not.toMatch(HEALTH_CLAIM_PATTERN);
  });
});

const PRODUCT_SIZES_FIXTURE = {
  size: "275 ml",
  box: "10 pcs / box",
  price: "Rp48.000",
};
