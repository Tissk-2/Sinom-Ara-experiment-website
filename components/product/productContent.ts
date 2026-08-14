export type NumberedItem = Readonly<{
  number: "01" | "02" | "03";
  title: string;
  description: string;
}>;

export const PRODUCT_FACTS = Object.freeze({
  brand: "Sinom ARA",
  location: "Malang, East Java",
  originEyebrow: "Brewed in Malang",
  originHeading: "A Javanese classic, brewed for right now.",
  originBody:
    "Sinom ARA brings a familiar Javanese refreshment into a careful small-batch ritual. Three natural ingredients, no artificial preservatives, and no shortcuts.",
  ingredientHeading: "Three ingredients, held in balance.",
  tasteHeading: "Sweet. Sour. Earthy.",
  tasteBody:
    "Bright tamarind leaf meets turmeric warmth and the rounded sweetness of palm sugar. Refreshing, grounded, and unmistakably sinom.",
  orderEyebrow: "This week's batch",
  orderHeading: "Freshly brewed. Ready when the batch is.",
  orderBody:
    "Sinom ARA is brewed weekly in Malang. Ask about the current batch and order directly through Instagram.",
  orderLabel: "Order this week on Instagram",
  instagramUrl: "https://www.instagram.com/sinomaramalang/",
} as const);

export const INGREDIENTS = Object.freeze([
  Object.freeze({
    number: "01",
    name: "Young tamarind leaves",
    description: "A bright, clean sourness that gives sinom its unmistakable lift.",
  }),
  Object.freeze({
    number: "02",
    name: "Fresh turmeric",
    description: "Earthy warmth and a deep golden tone.",
  }),
  Object.freeze({
    number: "03",
    name: "Palm sugar",
    description: "A rounded caramel sweetness that brings the blend into balance.",
  }),
] as const);

export const TASTE_NOTES = Object.freeze(["Bright", "Earthy", "Rounded"] as const);

export const PROCESS_STEPS = Object.freeze<readonly NumberedItem[]>([
  Object.freeze({
    number: "01",
    title: "Fresh ingredients",
    description: "Young tamarind leaves, fresh turmeric, and palm sugar.",
  }),
  Object.freeze({
    number: "02",
    title: "Small batches",
    description: "Prepared with the attention a short ingredient list deserves.",
  }),
  Object.freeze({
    number: "03",
    title: "Brewed weekly",
    description: "Fresh batches made in Malang and announced on Instagram.",
  }),
]);

export const PRODUCT_SIZES = Object.freeze([
  Object.freeze({
    size: "275 ml",
    box: "10 pcs / box",
    price: "Rp48.000",
    image: "/images/ara-sinom-bottle.jpg",
    description: "Signature glass bottle size, ideal for sharing or stocking up.",
  }),
  Object.freeze({
    size: "180 ml",
    box: "24 pcs / box",
    price: "Rp39.000",
    image: "/images/ara-sinom-options.jpg",
    description: "Compact bottle packaging, great for daily personal refreshment.",
  }),
  Object.freeze({
    size: "120 ml",
    box: "24 pcs / box",
    price: "Rp35.000",
    image: "/images/ara-sinom-options.jpg",
    description: "Convenient cup format, ideal for gatherings, events, and dining.",
  }),
] as const);

export const PRODUCT_DETAILS = Object.freeze({
  image: "/images/ara-sinom-lineup.jpg",
  kicker: "Gula Asli & Alami",
  heading: "Teman segar untuk hari-harimu",
  body: "Tersedia dalam pilihan kemasan botol dan cup yang praktis. Dinginkan sebelum dinikmati untuk rasa dan kesegaran terbaik.",
  facts: Object.freeze([
    Object.freeze({ label: "Asal", value: "Malang, Jawa Timur" }),
    Object.freeze({ label: "Pengiriman", value: "Se-Indonesia" }),
    Object.freeze({ label: "NIB Kemasan", value: "0703230061028" }),
  ]),
} as const);

export const RESELLER_INFO = Object.freeze({
  image: "/images/ara-sinom-reseller.jpg",
  kicker: "Tumbuh Bersama",
  heading: "Buka peluang reseller dan dropship",
  body: "Bawa kesegaran Sinom ARA ke pelanggan di kotamu. Dapatkan penawaran harga khusus mitra dengan pengiriman aman ke seluruh Indonesia.",
  ctaLabel: "Tanya Program Reseller",
} as const);

export const FAQS = Object.freeze([
  Object.freeze({
    question: "Bagaimana cara memesan?",
    answer: "Pilih ukuran yang diinginkan dan hubungi kami melalui Instagram @sinomaramalang untuk konfirmasi ketersediaan batch minggu ini.",
  }),
  Object.freeze({
    question: "Apakah bisa dikirim ke luar Malang?",
    answer: "Bisa dikirim ke berbagai kota di Indonesia. Hubungi kami untuk rincian ongkos kirim dan jadwal pengiriman batch.",
  }),
  Object.freeze({
    question: "Apakah menerima reseller dan dropship?",
    answer: "Ya, kami membuka kesempatan kemitraan reseller dan dropship dengan penawaran harga khusus.",
  }),
] as const);

export const GALLERY_IMAGES = Object.freeze([
  Object.freeze({
    src: "/images/ara-sinom-options.jpg",
    alt: "Pilihan ukuran dan varian kemasan Sinom ARA",
  }),
  Object.freeze({
    src: "/images/ara-sinom-bottle.jpg",
    alt: "Botol Sinom ARA 275 ml",
  }),
  Object.freeze({
    src: "/images/ara-sinom-lineup.jpg",
    alt: "Lineup produk Sinom ARA di Malang",
  }),
] as const);
