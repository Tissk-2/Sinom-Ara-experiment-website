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
