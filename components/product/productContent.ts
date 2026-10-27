export type NumberedItem = Readonly<{
  number: "01" | "02" | "03";
  title: string;
  description: string;
}>;

export const SITE_URL = "https://sinom-ara-experiment-website.vercel.app";

export const WHATSAPP_NUMBER = "6281617063757";

export function buildWhatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappOrderMessage(product: Readonly<{
  size: string;
  box: string;
  price: string;
}>): string {
  return `Halo Sinom ARA! Saya mau pesan kemasan ${product.size} (${product.box}, ${product.price}). Masih tersedia untuk batch minggu ini?`;
}

export const ORDER_MESSAGE =
  "Halo Sinom ARA! Saya ingin tanya ketersediaan batch minggu ini.";

export const PRODUCT_FACTS = Object.freeze({
  brand: "Sinom ARA",
  location: "Malang, East Java",
  originEyebrow: "Brewed in Malang",
  originHeading: "A Javanese classic, brewed for right now.",
  originBody:
    "Sinom ARA menghadirkan kesegaran khas Jawa lewat ritual seduh small-batch yang telaten. Tiga bahan alami, tanpa pengawet buatan, tanpa jalan pintas.",
  ingredientHeading: "Three ingredients, held in balance.",
  ingredientBody:
    "Tiga bahan alami, tanpa pengawet buatan. Asam yang menyegarkan, hangat yang membumi, dan manis yang menyeimbangkan.",
  tasteHeading: "Sweet. Sour. Earthy.",
  tasteBody:
    "Daun asam muda bertemu kehangatan kunyit dan manisnya gula aren. Menyegarkan, membumi, dan tetap khas sinom.",
  orderEyebrow: "This week's batch",
  orderHeading: "Freshly brewed. Ready when the batch is.",
  orderBody:
    "Sinom ARA diseduh setiap minggu di Malang. Tanyakan batch terbaru dan pesan langsung melalui WhatsApp kami.",
  orderLabel: "Pesan Batch Minggu Ini",
  instagramUrl: "https://www.instagram.com/sinomaramalang/",
  instagramLabel: "Lihat aktivitas kami di Instagram",
} as const);

export const INGREDIENTS = Object.freeze([
  Object.freeze({
    number: "01",
    name: "Young tamarind leaves",
    description: "Asam segar yang memberi karakter khas pada sinom.",
  }),
  Object.freeze({
    number: "02",
    name: "Fresh turmeric",
    description: "Kehangatan rempah dengan warna emas yang pekat.",
  }),
  Object.freeze({
    number: "03",
    name: "Palm sugar",
    description: "Manis karamel yang menyatukan seluruh rasa.",
  }),
] as const);

export const TASTE_NOTES = Object.freeze(["Bright", "Earthy", "Rounded"] as const);

export const PROCESS_STEPS = Object.freeze<readonly NumberedItem[]>([
  Object.freeze({
    number: "01",
    title: "Fresh ingredients",
    description: "Daun asam muda, kunyit segar, dan gula aren pilihan.",
  }),
  Object.freeze({
    number: "02",
    title: "Small batches",
    description: "Diseduh dalam jumlah kecil agar kualitas setiap botol tetap terjaga.",
  }),
  Object.freeze({
    number: "03",
    title: "Brewed weekly",
    description: "Batch baru dibuat setiap minggu di Malang dan diumumkan lewat Instagram.",
  }),
]);

export const PRODUCT_SIZES = Object.freeze([
  Object.freeze({
    size: "275 ml",
    box: "10 pcs / box",
    price: "Rp48.000",
    image: "/images/sinom-275ml.jpg",
    description: "Botol signature, cocok untuk berbagi atau stok mingguan.",
  }),
  Object.freeze({
    size: "180 ml",
    box: "24 pcs / box",
    price: "Rp39.000",
    image: "/images/sinom-180ml.jpg",
    description: "Kemasan cup ringkas, pas untuk teman minum sehari-hari.",
  }),
  Object.freeze({
    size: "120 ml",
    box: "24 pcs / box",
    price: "Rp35.000",
    image: "/images/sinom-120ml.jpg",
    description: "Format cup praktis, ideal untuk acara, rapat, dan santap bareng.",
  }),
] as const);

export const PRODUCT_DETAILS = Object.freeze({
  image: "/images/sinom-lineup.jpg",
  heading: "Teman segar untuk hari-harimu",
  body: "Tersedia dalam pilihan kemasan botol dan cup yang praktis. Dinginkan sebelum dinikmati untuk rasa dan kesegaran terbaik.",
  facts: Object.freeze([
    Object.freeze({ label: "Asal", value: "Malang, Jawa Timur" }),
    Object.freeze({ label: "Pengiriman", value: "Se-Indonesia" }),
    Object.freeze({ label: "NIB Kemasan", value: "0703230061028" }),
  ]),
} as const);

export const RESELLER_INFO = Object.freeze({
  image: "/images/sinom-reseller.jpg",
  kicker: "Tumbuh Bersama",
  heading: "Buka peluang reseller dan dropship",
  body: "Bawa kesegaran Sinom ARA ke pelanggan di kotamu. Dapatkan penawaran harga khusus mitra dengan pengiriman aman ke seluruh Indonesia.",
  ctaLabel: "Tanya Program Reseller",
  ctaMessage:
    "Halo Sinom ARA! Saya tertarik menjadi mitra reseller/dropship. Boleh info harga khusus mitra dan ketentuannya?",
} as const);

export const FAQS = Object.freeze([
  Object.freeze({
    question: "Bagaimana cara memesan?",
    answer: "Pilih ukuran yang diinginkan, lalu klik tombol Pesan via WhatsApp. Pesanmu sudah berisi detail kemasan, tinggal kirim untuk konfirmasi ketersediaan batch minggu ini.",
  }),
  Object.freeze({
    question: "Apakah bisa dikirim ke luar Malang?",
    answer: "Bisa dikirim ke berbagai kota di Indonesia. Tanyakan rincian ongkos kirim dan jadwal pengiriman batch melalui WhatsApp kami.",
  }),
  Object.freeze({
    question: "Apakah menerima reseller dan dropship?",
    answer: "Ya, kami membuka kesempatan kemitraan reseller dan dropship dengan penawaran harga khusus. Hubungi kami melalui WhatsApp untuk penawarannya.",
  }),
] as const);
