import Image from "next/image";
import {
  buildWhatsappLink,
  FAQS,
  INGREDIENTS,
  ORDER_MESSAGE,
  PROCESS_STEPS,
  PRODUCT_DETAILS,
  PRODUCT_FACTS,
  PRODUCT_SIZES,
  RESELLER_INFO,
  SITE_URL,
  TASTE_NOTES,
  whatsappOrderMessage,
} from "./productContent";
import SpotlightCard from "../reactbits/SpotlightCard";
import styles from "./ProductSections.module.css";

function SectionLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className={styles.label}>{children}</p>;
}

type NumberedListItem = Readonly<{
  number: string;
  title: string;
  description: string;
}>;

/**
 * Shared numbered list for ingredients and process steps.
 *
 * `motion-stagger` slots its children, so a real `ol`/`ul` cannot own them as
 * DOM children. Instead the wrapper carries `role="list"` and each item
 * `role="listitem"`, which gives assistive technology the same list structure.
 * The decorative numerals stay hidden so the order is announced once, by the
 * list itself, rather than read as stray text.
 */
function NumberedList({
  items,
  interval,
}: Readonly<{ items: readonly NumberedListItem[]; interval: string }>) {
  return (
    <motion-stagger interval={interval} role="list" className={styles.numberedList}>
      {items.map((item) => (
        <div key={item.number} role="listitem" className={styles.numberedItem}>
          <span aria-hidden="true">{item.number}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </motion-stagger>
  );
}

function buildProductJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kemasan Sinom ARA",
    itemListElement: PRODUCT_SIZES.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `Sinom ARA ${product.size}`,
        image: `${SITE_URL}${product.image}`,
        description: product.description,
        brand: { "@type": "Brand", name: PRODUCT_FACTS.brand },
        offers: {
          "@type": "Offer",
          price: product.price.replace(/\D/g, ""),
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}#produk`,
        },
      },
    })),
  };
}

export default function ProductSections() {
  const productJsonLd = buildProductJsonLd();

  return (
    <div data-product-content className={styles.surface}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* ─── 1. Origin / Heritage with Hero Image ─── */}
      <section id="heritage" aria-labelledby="origin-heading" className={styles.origin}>
        <div className={styles.originText}>
          <SectionLabel>{PRODUCT_FACTS.originEyebrow}</SectionLabel>
          <h2 id="origin-heading">{PRODUCT_FACTS.originHeading}</h2>
          <div className={styles.originCopy}>
            <p>{PRODUCT_FACTS.originBody}</p>
            <p className={styles.location}>{PRODUCT_FACTS.location} · Indonesia</p>
          </div>
        </div>
        <div className={styles.originImageWrapper}>
          <Image
            src="/images/ara-sinom-hero.jpg"
            alt="Sinom ARA botol segar dalam genggaman"
            width={512}
            height={640}
            loading="eager"
            className={styles.originImage}
          />
        </div>
      </section>


      {/* ─── 2. Ingredients ─── */}
      <section id="ingredients" aria-labelledby="ingredients-heading" className={styles.ingredients}>
        <motion-reveal>
          <h2 id="ingredients-heading">{PRODUCT_FACTS.ingredientHeading}</h2>
          <p className={styles.ingredientBody}>{PRODUCT_FACTS.ingredientBody}</p>
        </motion-reveal>
        <NumberedList
          interval="0.12"
          items={INGREDIENTS.map((item) => ({
            number: item.number,
            title: item.name,
            description: item.description,
          }))}
        />
      </section>

      {/* ─── 3. Product Lineup / Pilihan Ukuran with React Bits SpotlightCards ─── */}
      <section id="produk" aria-labelledby="products-title" className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <motion-reveal>
            <h2 id="products-title">Pilih Ukuran Sesuai Kebutuhanmu</h2>
            <p className={styles.subheading}>
              Harga terjangkau per box dengan kemasan higienis dan bahan alami pilihan.
            </p>
          </motion-reveal>
        </div>

        <motion-stagger interval="0.1" className={styles.productGrid}>
          {PRODUCT_SIZES.map((product) => (
            <a
              key={product.size}
              href={buildWhatsappLink(whatsappOrderMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.productCardLink}
            >
              <SpotlightCard
                className={styles.productCard}
                spotlightColor="rgba(217, 130, 24, 0.14)"
              >
                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.image}
                    alt={`Kemasan Sinom ARA ${product.size}`}
                    width={640}
                    height={800}
                    loading="lazy"
                    className={styles.productImage}
                  />
                  <span aria-hidden="true" className={styles.productSizeBadge}>
                    {product.size}
                  </span>
                </div>
                <div className={styles.productCardBody}>
                  <div className={styles.productCardTop}>
                    <h3 className={styles.productCardTitle}>{product.size}</h3>
                    <p className={styles.productCardBox}>{product.box}</p>
                  </div>
                  <p className={styles.productCardDesc}>{product.description}</p>
                  <div className={styles.productCardFooter}>
                    <strong className={styles.productPrice}>{product.price}</strong>
                    <span className={styles.cardOrderLink}>
                      Pesan via WhatsApp <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </a>
          ))}
        </motion-stagger>
      </section>

      {/* ─── 4. Product Details & Craftsmanship ─── */}
      <section id="details" aria-labelledby="details-title" className={styles.detailsSection}>
        <div className={styles.detailsImageWrapper}>
          <Image
            src={PRODUCT_DETAILS.image}
            alt="Pilihan kemasan botol dan cup Sinom ARA"
            width={640}
            height={800}
            loading="lazy"
            className={styles.detailsImage}
          />
        </div>
        <div className={styles.detailsContent}>
          <motion-reveal>
            <h2 id="details-title">{PRODUCT_DETAILS.heading}</h2>
            <p className={styles.detailsBody}>{PRODUCT_DETAILS.body}</p>
            <dl className={styles.factsGrid}>
              {PRODUCT_DETAILS.facts.map((fact) => (
                <div key={fact.label} className={styles.factItem}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </motion-reveal>
        </div>
      </section>

      {/* ─── 5. Reseller / Partnership ─── */}
      <section id="reseller" aria-labelledby="reseller-title" className={styles.reseller}>
        <div className={styles.resellerImageWrapper}>
          <Image
            src={RESELLER_INFO.image}
            alt="Kemasan Sinom ARA untuk mitra reseller dan dropship"
            width={640}
            height={800}
            loading="lazy"
            className={styles.resellerImage}
          />
        </div>
        <div className={styles.resellerContent}>
          <motion-reveal>
            <SectionLabel>{RESELLER_INFO.kicker}</SectionLabel>
            <h2 id="reseller-title">{RESELLER_INFO.heading}</h2>
            <p className={styles.resellerBody}>{RESELLER_INFO.body}</p>
            <a
              href={buildWhatsappLink(RESELLER_INFO.ctaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resellerCta}
            >
              {RESELLER_INFO.ctaLabel}
            </a>
          </motion-reveal>
        </div>
      </section>

      {/* ─── 6. Taste & Craft ─── */}
      <section id="taste-craft" aria-labelledby="taste-heading" className={styles.craft}>
        <div>
          <motion-reveal>
            <h2 id="taste-heading">{PRODUCT_FACTS.tasteHeading}</h2>
            <p>{PRODUCT_FACTS.tasteBody}</p>
            <ul className={styles.tasteNotes}>
              {TASTE_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </motion-reveal>
        </div>
        <div>
          <NumberedList
            interval="0.1"
            items={PROCESS_STEPS.map((item) => ({
              number: item.number,
              title: item.title,
              description: item.description,
            }))}
          />
        </div>
      </section>

      {/* ─── 7. FAQ Accordion ─── */}
      <section id="faq" aria-labelledby="faq-title" className={styles.faqSection}>
        <motion-reveal>
          <div className={styles.faqHeadingWrapper}>
            <h2 id="faq-title">Pertanyaan yang Sering Diajukan</h2>
          </div>
        </motion-reveal>
        <div className={styles.faqList}>
          {FAQS.map((faq) => (
            <details key={faq.question} className={styles.faqDetail}>
              <summary className={styles.faqSummary}>{faq.question}</summary>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── 8. Final Conversion / Order Section ─── */}
      <section id="order" aria-labelledby="order-heading" className={styles.order}>
        <div className={styles.orderCopy}>
          <SectionLabel>{PRODUCT_FACTS.orderEyebrow}</SectionLabel>
          <h2 id="order-heading">{PRODUCT_FACTS.orderHeading}</h2>
          <p>{PRODUCT_FACTS.orderBody}</p>
          <a
            href={buildWhatsappLink(ORDER_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryCta}
          >
            {PRODUCT_FACTS.orderLabel}
          </a>
          <a
            href={PRODUCT_FACTS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryCta}
          >
            {PRODUCT_FACTS.instagramLabel}
          </a>
        </div>
        <div aria-hidden="true" className={styles.sun} />
      </section>

      {/* ─── 9. Minimal Footer ─── */}
      <footer className={styles.footer}>
        <div>
          <p className={styles.footerBrand}>{PRODUCT_FACTS.brand}</p>
          <p className={styles.footerLocation}>{PRODUCT_FACTS.location} · Indonesia</p>
        </div>
        <div>
          <a
            href={PRODUCT_FACTS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lihat Sinom ARA di Instagram"
          >
            Instagram
          </a>
          <p>© {new Date().getFullYear()} Sinom ARA</p>
        </div>
      </footer>
    </div>
  );
}
