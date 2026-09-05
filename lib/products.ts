export const shopCategories = ["sneakers", "t-shirts", "hoodies", "pants"] as const;
export type ShopCategory = (typeof shopCategories)[number];
export type SortOption = "featured" | "newest" | "price-low" | "price-high" | "name";

export const categoryLabels: Record<ShopCategory, string> = {
  sneakers: "Sneakers",
  "t-shirts": "T-Shirts",
  hoodies: "Hoodies",
  pants: "Pants",
};

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ShopCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  isSale: boolean;
  isNew: boolean;
  description: string;
  /** Full gallery, retained for future product-detail pages. */
  images: readonly string[];
  /** Explicit card mappings avoid accidental cross-product image rotation. */
  primaryImage: string;
  hoverImage: string;
  colors: readonly string[];
  sizes: readonly string[];
  stock: number;
  rating: number;
  reviewCount: number;
};

const shoeSizes = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"] as const;
const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const sneaker = (product: Omit<ShopProduct, "id" | "slug" | "rating" | "reviewCount">): ShopProduct => {
  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return { ...product, id: slug, slug, rating: 4.8, reviewCount: 24 };
};

export const products: readonly ShopProduct[] = [
  sneaker({
    name: "New Balance 550", brand: "New Balance", category: "sneakers", subcategory: "Court",
    price: 120, isSale: false, isNew: true, description: "Structured leather court sneaker with a refined everyday profile.",
    images: ["/products/sneakers/product-01.png"], primaryImage: "/products/sneakers/product-01.png", hoverImage: "/products/sneakers/product-01.png",
    colors: ["White", "Gray"], sizes: shoeSizes, stock: 18,
  }),
  sneaker({
    name: "Adidas Samba OG", brand: "Adidas", category: "sneakers", subcategory: "Terrace",
    price: 110, isSale: false, isNew: true, description: "Low-profile leather icon with contrast stripes.",
    images: ["/products/sneakers/product-02.png"], primaryImage: "/products/sneakers/product-02.png", hoverImage: "/products/sneakers/product-02.png",
    colors: ["Black", "White", "Brown"], sizes: shoeSizes, stock: 12,
  }),
  sneaker({
    name: "Nike Air Force 1 '07", brand: "Nike", category: "sneakers", subcategory: "Court",
    price: 115, isSale: false, isNew: false, description: "Clean white leather sneaker with heritage court proportions.",
    images: ["/products/sneakers/product-03.png"], primaryImage: "/products/sneakers/product-03.png", hoverImage: "/products/sneakers/product-03.png",
    colors: ["White"], sizes: shoeSizes, stock: 24,
  }),
  sneaker({
    name: "Salomon XT-6 Expanse", brand: "Salomon", category: "sneakers", subcategory: "Trail",
    price: 195, isSale: false, isNew: true, description: "Trail-built comfort for the city and beyond.",
    images: ["/products/sneakers/product-04.png"], primaryImage: "/products/sneakers/product-04.png", hoverImage: "/products/sneakers/product-04.png",
    colors: ["Beige", "Brown"], sizes: shoeSizes, stock: 14,
  }),
  sneaker({
    name: "VANTA Black Graffiti Fleece Hoodie", brand: "VANTA", category: "hoodies", subcategory: "Fleece",
    price: 138, originalPrice: 165, isSale: true, isNew: true, description: "Heavy black fleece hoodie finished with an expressive VANTA graphic.",
    images: [
      "/products/hoodies/vanta-black-graffiti-hoodie/01-lifestyle-front.webp",
      "/products/hoodies/vanta-black-graffiti-hoodie/02-detail-sleeve.webp",
      "/products/hoodies/vanta-black-graffiti-hoodie/03-product-front.webp",
      "/products/hoodies/vanta-black-graffiti-hoodie/04-product-back.webp",
    ],
    primaryImage: "/products/hoodies/vanta-black-graffiti-hoodie/01-lifestyle-front.webp",
    hoverImage: "/products/hoodies/vanta-black-graffiti-hoodie/02-detail-sleeve.webp",
    colors: ["Black"], sizes: apparelSizes, stock: 16,
  }),
  sneaker({
    name: "VANTA Washed Olive V Graphic Hoodie", brand: "VANTA", category: "hoodies", subcategory: "Fleece",
    price: 132, isSale: false, isNew: true, description: "Washed olive fleece hoodie with a considered V graphic.",
    images: [
      "/products/hoodies/vanta-washed-olive-v-hoodie/01-product-front.webp",
      "/products/hoodies/vanta-washed-olive-v-hoodie/02-lifestyle-back.webp",
      "/products/hoodies/vanta-washed-olive-v-hoodie/03-lifestyle-front.webp",
      "/products/hoodies/vanta-washed-olive-v-hoodie/04-product-back.webp",
    ],
    primaryImage: "/products/hoodies/vanta-washed-olive-v-hoodie/01-product-front.webp",
    hoverImage: "/products/hoodies/vanta-washed-olive-v-hoodie/02-lifestyle-back.webp",
    colors: ["Green"], sizes: apparelSizes, stock: 13,
  }),
  sneaker({
    name: "VANTA Black Contrast Seam Hoodie", brand: "VANTA", category: "hoodies", subcategory: "Fleece",
    price: 142, isSale: false, isNew: true, description: "Relaxed black hoodie defined by exposed contrast seam work.",
    images: [
      "/products/hoodies/vanta-black-contrast-seam-hoodie/01-product-front.webp",
      "/products/hoodies/vanta-black-contrast-seam-hoodie/02-lifestyle-back.webp",
      "/products/hoodies/vanta-black-contrast-seam-hoodie/03-lifestyle-front.webp",
      "/products/hoodies/vanta-black-contrast-seam-hoodie/04-product-back.webp",
    ],
    primaryImage: "/products/hoodies/vanta-black-contrast-seam-hoodie/01-product-front.webp",
    hoverImage: "/products/hoodies/vanta-black-contrast-seam-hoodie/02-lifestyle-back.webp",
    colors: ["Black"], sizes: apparelSizes, stock: 11,
  }),
  sneaker({
    name: "VANTA Washed Taupe Zip Hoodie", brand: "VANTA", category: "hoodies", subcategory: "Zip fleece",
    price: 148, originalPrice: 178, isSale: true, isNew: false, description: "Washed taupe zip hoodie with a softly structured drape.",
    images: [
      "/products/hoodies/vanta-washed-taupe-zip-hoodie/01-product-front.webp",
      "/products/hoodies/vanta-washed-taupe-zip-hoodie/02-product-back.webp",
    ],
    primaryImage: "/products/hoodies/vanta-washed-taupe-zip-hoodie/01-product-front.webp",
    hoverImage: "/products/hoodies/vanta-washed-taupe-zip-hoodie/02-product-back.webp",
    colors: ["Taupe", "Beige"], sizes: apparelSizes, stock: 9,
  }),
  sneaker({
    name: "VANTA Black Contrast Panel Tee", brand: "VANTA", category: "t-shirts", subcategory: "Graphic",
    price: 64, isSale: false, isNew: true, description: "Structured cotton jersey tee with contrast-panel detailing.",
    images: [
      "/products/tshirts/vanta-black-contrast-panel-tee/01-product-front.webp",
      "/products/tshirts/vanta-black-contrast-panel-tee/02-product-back.webp",
      "/products/tshirts/vanta-black-contrast-panel-tee/03-lifestyle-front.webp",
      "/products/tshirts/vanta-black-contrast-panel-tee/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/tshirts/vanta-black-contrast-panel-tee/01-product-front.webp",
    hoverImage: "/products/tshirts/vanta-black-contrast-panel-tee/02-product-back.webp",
    colors: ["Black", "White"], sizes: apparelSizes, stock: 22,
  }),
  sneaker({
    name: "VANTA Black 11 Jersey Tee", brand: "VANTA", category: "t-shirts", subcategory: "Jersey",
    price: 72, isSale: false, isNew: true, description: "Relaxed football-inspired jersey tee with distressed VANTA numbering.",
    images: [
      "/products/tshirts/vanta-black-11-jersey-tee/01-product-back.webp",
      "/products/tshirts/vanta-black-11-jersey-tee/02-product-front.webp",
      "/products/tshirts/vanta-black-11-jersey-tee/03-lifestyle-front.webp",
      "/products/tshirts/vanta-black-11-jersey-tee/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/tshirts/vanta-black-11-jersey-tee/01-product-back.webp",
    hoverImage: "/products/tshirts/vanta-black-11-jersey-tee/02-product-front.webp",
    colors: ["Black", "White"], sizes: apparelSizes, stock: 18,
  }),
  sneaker({
    name: "VANTA White Globe Logo Tee", brand: "VANTA", category: "t-shirts", subcategory: "Graphic",
    price: 58, originalPrice: 70, isSale: true, isNew: false, description: "Clean white jersey tee with a compact globe logo treatment.",
    images: [
      "/products/tshirts/vanta-white-globe-logo-tee/01-product-front.webp",
      "/products/tshirts/vanta-white-globe-logo-tee/02-product-back.webp",
      "/products/tshirts/vanta-white-globe-logo-tee/03-lifestyle-front.webp",
      "/products/tshirts/vanta-white-globe-logo-tee/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/tshirts/vanta-white-globe-logo-tee/01-product-front.webp",
    hoverImage: "/products/tshirts/vanta-white-globe-logo-tee/02-product-back.webp",
    colors: ["White"], sizes: apparelSizes, stock: 20,
  }),
  sneaker({
    name: "VANTA White Rich Culture Graphic Tee", brand: "VANTA", category: "t-shirts", subcategory: "Graphic",
    price: 62, isSale: false, isNew: true, description: "Heavy white cotton tee with a large-scale Rich Culture graphic.",
    images: [
      "/products/tshirts/vanta-white-rich-culture-graphic-tee/01-product-front.webp",
      "/products/tshirts/vanta-white-rich-culture-graphic-tee/02-product-back.webp",
      "/products/tshirts/vanta-white-rich-culture-graphic-tee/03-lifestyle-front.webp",
      "/products/tshirts/vanta-white-rich-culture-graphic-tee/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/tshirts/vanta-white-rich-culture-graphic-tee/01-product-front.webp",
    hoverImage: "/products/tshirts/vanta-white-rich-culture-graphic-tee/02-product-back.webp",
    colors: ["White"], sizes: apparelSizes, stock: 15,
  }),
  sneaker({
    name: "VANTA Black Graffiti Fleece Pants", brand: "VANTA", category: "pants", subcategory: "Fleece",
    price: 116, isSale: false, isNew: true, description: "Relaxed black fleece pants with a matching graffiti statement.",
    images: [
      "/products/pants/vanta-black-graffiti-fleece-pants/01-product-front.webp",
      "/products/pants/vanta-black-graffiti-fleece-pants/02-product-back.webp",
      "/products/pants/vanta-black-graffiti-fleece-pants/03-lifestyle-front.webp",
      "/products/pants/vanta-black-graffiti-fleece-pants/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/pants/vanta-black-graffiti-fleece-pants/01-product-front.webp",
    hoverImage: "/products/pants/vanta-black-graffiti-fleece-pants/02-product-back.webp",
    colors: ["Black"], sizes: apparelSizes, stock: 14,
  }),
  sneaker({
    name: "VANTA Black Denim Barrel Jeans", brand: "VANTA", category: "pants", subcategory: "Denim",
    price: 138, isSale: false, isNew: true, description: "Black denim barrel jeans with a deliberately rounded leg.",
    images: [
      "/products/pants/vanta-black-denim-barrel-jeans/01-product-front.webp",
      "/products/pants/vanta-black-denim-barrel-jeans/02-product-back.jpg",
      "/products/pants/vanta-black-denim-barrel-jeans/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/pants/vanta-black-denim-barrel-jeans/01-product-front.webp",
    hoverImage: "/products/pants/vanta-black-denim-barrel-jeans/02-product-back.jpg",
    colors: ["Black"], sizes: apparelSizes, stock: 10,
  }),
  sneaker({
    name: "VANTA Black Contrast Seam Track Pants", brand: "VANTA", category: "pants", subcategory: "Track",
    price: 122, originalPrice: 148, isSale: true, isNew: false, description: "Relaxed track pants cut with the collection's contrast seam language.",
    images: [
      "/products/pants/vanta-black-contrast-seam-track-pants/01-product-front.webp",
      "/products/pants/vanta-black-contrast-seam-track-pants/02-product-back.webp",
      "/products/pants/vanta-black-contrast-seam-track-pants/03-lifestyle-front.webp",
      "/products/pants/vanta-black-contrast-seam-track-pants/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/pants/vanta-black-contrast-seam-track-pants/01-product-front.webp",
    hoverImage: "/products/pants/vanta-black-contrast-seam-track-pants/02-product-back.webp",
    colors: ["Black"], sizes: apparelSizes, stock: 12,
  }),
  sneaker({
    name: "VANTA Black Plaid Waist Shorts", brand: "VANTA", category: "pants", subcategory: "Shorts",
    price: 98, isSale: false, isNew: false, description: "Black shorts finished with a layered plaid waist detail.",
    images: [
      "/products/pants/vanta-black-plaid-waist-shorts/01-product-front.webp",
      "/products/pants/vanta-black-plaid-waist-shorts/02-product-back.webp",
      "/products/pants/vanta-black-plaid-waist-shorts/03-lifestyle-front.webp",
      "/products/pants/vanta-black-plaid-waist-shorts/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/pants/vanta-black-plaid-waist-shorts/01-product-front.webp",
    hoverImage: "/products/pants/vanta-black-plaid-waist-shorts/02-product-back.webp",
    colors: ["Black", "Gray"], sizes: apparelSizes, stock: 17,
  }),
  sneaker({
    name: "VANTA Black Plaid Waist Barrel Pants", brand: "VANTA", category: "pants", subcategory: "Tailored",
    price: 128, isSale: false, isNew: true, description: "Rounded black barrel pants with an understated plaid waist reveal.",
    images: [
      "/products/pants/vanta-black-plaid-waist-barrel-pants/01-product-front.webp",
      "/products/pants/vanta-black-plaid-waist-barrel-pants/03-lifestyle-front (1).webp",
      "/products/pants/vanta-black-plaid-waist-barrel-pants/03-lifestyle-front (2).webp",
      "/products/pants/vanta-black-plaid-waist-barrel-pants/04-lifestyle-back.webp",
    ],
    primaryImage: "/products/pants/vanta-black-plaid-waist-barrel-pants/01-product-front.webp",
    hoverImage: "/products/pants/vanta-black-plaid-waist-barrel-pants/01-product-front.webp",
    colors: ["Black", "Gray"], sizes: apparelSizes, stock: 8,
  }),
  sneaker({
    name: "VANTA Washed Wide-Leg Pants", brand: "VANTA", category: "pants", subcategory: "Wide leg",
    price: 132, originalPrice: 156, isSale: true, isNew: true, description: "Washed wide-leg pants offered in tonal front-view colour variants.",
    images: [
      "/products/pants/vanta-washed-wide-leg-pants/01-product-front-taupe.webp",
      "/products/pants/vanta-washed-wide-leg-pants/02-product-front-taupe-vanta.webp",
      "/products/pants/vanta-washed-wide-leg-pants/03-product-front-gray.webp",
      "/products/pants/vanta-washed-wide-leg-pants/04-product-front-light-gray.webp",
      "/products/pants/vanta-washed-wide-leg-pants/05-product-front-charcoal.webp",
    ],
    primaryImage: "/products/pants/vanta-washed-wide-leg-pants/01-product-front-taupe.webp",
    hoverImage: "/products/pants/vanta-washed-wide-leg-pants/01-product-front-taupe.webp",
    colors: ["Taupe", "Gray", "Light Gray", "Charcoal"], sizes: apparelSizes, stock: 19,
  }),
];

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const brands = [...new Set(products.map((item) => item.brand))].sort();
export const colors = ["Black", "White", "Gray", "Beige", "Green", "Brown", "Taupe", "Charcoal"] as const;
