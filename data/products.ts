import { getCategoryBySlug } from "@/data/categories";
import {
  Product,
  ProductFilter,
  ProductSort,
  ProductCategorySlug,
} from "@/types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

export const products: Product[] = [
  {
    id: "p1",
    name: "Rosa Dantel Sutyen Takimi",
    slug: "rosa-dantel-sutyen-takimi",
    category: "takimlar",
    price: 1290,
    oldPrice: 1590,
    images: [
      img("photo-1617019114583-affb34d1b3cd"),
      img("photo-1583515558997-83406f8e024e"),
    ],
    colors: [
      { name: "Pudra", hex: "#f5c2cd" },
      { name: "Siyah", hex: "#0c0c0d" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 12,
    description:
      "El isciligi dantel detaylari, ipeksi astari ve yumusak dokusuyla gun boyu zarif hissettiren ozel takim.",
    isFeatured: true,
    isNew: true,
  },
  {
    id: "p2",
    name: "Soft Touch Bralette",
    slug: "soft-touch-bralette",
    category: "sutyenler",
    price: 690,
    images: [
      img("photo-1594224457860-23bdb45f8b59"),
      img("photo-1606902965551-dce093cda6e7"),
    ],
    colors: [
      { name: "Pudra", hex: "#fadce3" },
      { name: "Beyaz", hex: "#ffffff" },
      { name: "Siyah", hex: "#0c0c0d" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 30,
    description:
      "Telsiz, dikissiz ve nefes alabilen yapisiyla gunluk kullanima uygun, ikinci ten hissi veren hafif bralette.",
    isFeatured: true,
  },
  {
    id: "p3",
    name: "Ipek Saten Gecelik",
    slug: "ipek-saten-gecelik",
    category: "gecelikler",
    price: 2490,
    oldPrice: 2890,
    images: [
      img("photo-1617922001439-4a2e6562f328"),
      img("photo-1617019114583-affb34d1b3cd"),
    ],
    colors: [
      { name: "Sampanya", hex: "#f4e6d8" },
      { name: "Pudra", hex: "#f5c2cd" },
    ],
    sizes: ["S", "M", "L"],
    stock: 8,
    description:
      "Saf ipek saten kumasi, yumusak askilari ve zarif kesimiyle ozel geceler icin premium gecelik.",
    isFeatured: true,
    isNew: true,
  },
  {
    id: "p4",
    name: "Klasik Brazilian Kulot",
    slug: "klasik-brazilian-kulot",
    category: "kulotlar",
    price: 290,
    images: [
      img("photo-1606902965551-dce093cda6e7"),
      img("photo-1594224457860-23bdb45f8b59"),
    ],
    colors: [
      { name: "Pudra", hex: "#fadce3" },
      { name: "Siyah", hex: "#0c0c0d" },
      { name: "Beyaz", hex: "#ffffff" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 50,
    description:
      "Yumusak modal kumasi ve dikissiz kenarlariyla kiyafet altinda iz yapmayan rahat kesim kulot.",
  },
  {
    id: "p5",
    name: "Luks Push-Up Sutyen",
    slug: "luks-push-up-sutyen",
    category: "sutyenler",
    price: 1190,
    images: [
      img("photo-1583515558997-83406f8e024e"),
      img("photo-1617019114583-affb34d1b3cd"),
    ],
    colors: [
      { name: "Siyah", hex: "#0c0c0d" },
      { name: "Pudra", hex: "#f5c2cd" },
    ],
    sizes: ["75B", "80B", "85B", "75C", "80C"],
    stock: 18,
    description:
      "Hafif dolgulu ve form veren yapisiyla destekli, gunluk ve ozel gun kullanimi icin sutyen.",
    isFeatured: true,
  },
  {
    id: "p6",
    name: "Sortlu Pijama Takimi",
    slug: "sortlu-pijama-takimi",
    category: "sortlu-takimlar",
    price: 1490,
    oldPrice: 1790,
    images: [
      img("photo-1606902965551-dce093cda6e7"),
      img("photo-1617922001439-4a2e6562f328"),
    ],
    colors: [
      { name: "Pudra", hex: "#fadce3" },
      { name: "Beyaz", hex: "#ffffff" },
    ],
    sizes: ["S", "M", "L"],
    stock: 14,
    description:
      "Saten dokusu, yumusak kumasi ve zarif fiyonk detayi ile ev rahatligini butik bir dokunusla bulusturur.",
    isNew: true,
  },
  {
    id: "p7",
    name: "Spor Bralet",
    slug: "spor-bralet",
    category: "spor",
    price: 590,
    images: [
      img("photo-1571019613454-1cb2f99b2d8b"),
      img("photo-1594224457860-23bdb45f8b59"),
    ],
    colors: [
      { name: "Siyah", hex: "#0c0c0d" },
      { name: "Pudra", hex: "#f5c2cd" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 25,
    description:
      "Orta destekli, nefes alabilen ve hareket ozgurlugu sunan spor bralet.",
  },
  {
    id: "p8",
    name: "Dantel Detayli Body",
    slug: "dantel-detayli-body",
    category: "takimlar",
    price: 1890,
    images: [
      img("photo-1617019114583-affb34d1b3cd"),
      img("photo-1617922001439-4a2e6562f328"),
    ],
    colors: [
      { name: "Siyah", hex: "#0c0c0d" },
      { name: "Beyaz", hex: "#ffffff" },
    ],
    sizes: ["S", "M", "L"],
    stock: 6,
    description:
      "Tul ve dantel detaylariyla ozel anlar icin zarif, vucuda oturan premium body.",
    isFeatured: true,
    isNew: true,
  },
];

export function isProductOnSale(product: Product) {
  return Boolean(product.oldPrice && product.oldPrice > product.price);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured);
}

export function getNewProducts() {
  return products.filter((product) => product.isNew);
}

export function getSaleProducts() {
  return products.filter(isProductOnSale);
}

export function getRelatedProducts(
  productId: string,
  category: Product["category"],
  limit = 4
) {
  return products
    .filter((product) => product.category === category && product.id !== productId)
    .slice(0, limit);
}

export function getCategoryName(category: ProductCategorySlug) {
  return getCategoryBySlug(category)?.name ?? category;
}

export function getAvailableSizes(items: Product[] = products) {
  return Array.from(
    new Set(items.flatMap((product) => product.sizes))
  ).sort((left, right) =>
    left.localeCompare(right, "tr", { numeric: true, sensitivity: "base" })
  );
}

export function getAvailableColors(items: Product[] = products) {
  return Array.from(
    new Set(items.flatMap((product) => product.colors.map((color) => color.name)))
  ).sort((left, right) => left.localeCompare(right, "tr"));
}

function getFeaturedScore(product: Product) {
  return (
    (product.isFeatured ? 2 : 0) +
    (product.isNew ? 1 : 0) +
    (isProductOnSale(product) ? 1 : 0)
  );
}

function getSearchableText(product: Product) {
  return [
    product.name,
    product.description,
    getCategoryName(product.category),
    ...product.sizes,
    ...product.colors.map((color) => color.name),
  ]
    .join(" ")
    .toLocaleLowerCase("tr");
}

export function sortProducts(items: Product[], sort: ProductSort) {
  const list = [...items];

  switch (sort) {
    case "new":
      return list.sort(
        (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew))
      );
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "featured":
    default:
      return list.sort((a, b) => getFeaturedScore(b) - getFeaturedScore(a));
  }
}

export function filterProducts(args: {
  category?: Product["category"] | "all";
  filter?: ProductFilter;
  sort?: ProductSort;
  query?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
}) {
  const {
    category = "all",
    filter = "all",
    sort = "featured",
    query = "",
    sizes = [],
    colors = [],
    minPrice,
    maxPrice,
  } = args;
  let filtered = [...products];
  const normalizedQuery = query.trim().toLocaleLowerCase("tr");

  if (category !== "all") {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (filter === "new") {
    filtered = filtered.filter((product) => product.isNew);
  }

  if (filter === "sale") {
    filtered = filtered.filter(isProductOnSale);
  }

  if (normalizedQuery) {
    filtered = filtered.filter((product) =>
      getSearchableText(product).includes(normalizedQuery)
    );
  }

  if (sizes.length > 0) {
    filtered = filtered.filter((product) =>
      product.sizes.some((size) => sizes.includes(size))
    );
  }

  if (colors.length > 0) {
    filtered = filtered.filter((product) =>
      product.colors.some((color) => colors.includes(color.name))
    );
  }

  if (typeof minPrice === "number") {
    filtered = filtered.filter((product) => product.price >= minPrice);
  }

  if (typeof maxPrice === "number") {
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }

  return sortProducts(filtered, sort);
}
