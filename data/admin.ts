import {
  AdminCategory,
  AdminOrder,
  AdminProduct,
  AdminSettings,
} from "@/types";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export const adminProducts: AdminProduct[] = products.map((product, index) => ({
  ...product,
  sku: `LR-${product.id.toUpperCase()}-${index + 11}`,
  status: index === 6 ? "passive" : "active",
  createdAt: `2026-0${(index % 4) + 1}-${String((index + 3) * 2).padStart(2, "0")}`,
  updatedAt: `2026-04-${String(10 + index).padStart(2, "0")}`,
}));

export const adminCategories: AdminCategory[] = categories.map(
  (category, index) => ({
    ...category,
    status: index === 5 ? "passive" : "active",
    description:
      "Koleksiyonda vitrinlenen ana kategori. Ileride harici bir veri kaynagindan yonetilecek sekilde hazirlandi.",
  })
);

const buildOrderTotal = (
  subtotal: number,
  shippingFee: number,
  discount: number
) => subtotal + shippingFee - discount;

export const adminOrders: AdminOrder[] = [
  {
    id: "o1",
    orderNumber: "LR-240421",
    createdAt: "2026-04-24T10:15:00.000Z",
    status: "beklemede",
    paymentStatus: "bekleniyor",
    shippingStatus: "hazirlaniyor",
    customer: {
      firstName: "Ece",
      lastName: "Yilmaz",
      email: "ece@example.com",
      phone: "+90 555 111 22 33",
      city: "Istanbul",
      district: "Kadikoy",
      address: "Moda Caddesi No: 14 Daire: 3",
    },
    items: [
      {
        id: "oi-1",
        productId: "p1",
        productName: "Rosa Dantel Sutyen Takimi",
        productSlug: "rosa-dantel-sutyen-takimi",
        image: adminProducts[0].images[0],
        unitPrice: 1290,
        quantity: 1,
        color: "Pudra",
        size: "M",
      },
      {
        id: "oi-2",
        productId: "p4",
        productName: "Klasik Brazilian Kulot",
        productSlug: "klasik-brazilian-kulot",
        image: adminProducts[3].images[0],
        unitPrice: 290,
        quantity: 2,
        color: "Siyah",
        size: "M",
      },
    ],
    subtotal: 1870,
    shippingFee: 0,
    discount: 180,
    total: buildOrderTotal(1870, 0, 180),
    note: "Aksam teslimati tercih ediyor.",
  },
  {
    id: "o2",
    orderNumber: "LR-240418",
    createdAt: "2026-04-24T08:40:00.000Z",
    status: "hazirlaniyor",
    paymentStatus: "odendi",
    shippingStatus: "paketlendi",
    customer: {
      firstName: "Sena",
      lastName: "Aydin",
      email: "sena@example.com",
      phone: "+90 555 222 33 44",
      city: "Ankara",
      district: "Cankaya",
      address: "Yildiz Mahallesi 211. Sokak No: 8",
    },
    items: [
      {
        id: "oi-3",
        productId: "p3",
        productName: "Ipek Saten Gecelik",
        productSlug: "ipek-saten-gecelik",
        image: adminProducts[2].images[0],
        unitPrice: 2490,
        quantity: 1,
        color: "Sampanya",
        size: "S",
      },
    ],
    subtotal: 2490,
    shippingFee: 0,
    discount: 0,
    total: 2490,
  },
  {
    id: "o3",
    orderNumber: "LR-240417",
    createdAt: "2026-04-23T19:20:00.000Z",
    status: "kargoya-verildi",
    paymentStatus: "odendi",
    shippingStatus: "yolda",
    customer: {
      firstName: "Melis",
      lastName: "Kara",
      email: "melis@example.com",
      phone: "+90 555 333 44 55",
      city: "Izmir",
      district: "Bornova",
      address: "Kazimdirik Mahallesi 1453 Sokak No: 27",
    },
    items: [
      {
        id: "oi-4",
        productId: "p6",
        productName: "Sortlu Pijama Takimi",
        productSlug: "sortlu-pijama-takimi",
        image: adminProducts[5].images[0],
        unitPrice: 1490,
        quantity: 1,
        color: "Beyaz",
        size: "L",
      },
    ],
    subtotal: 1490,
    shippingFee: 120,
    discount: 0,
    total: buildOrderTotal(1490, 120, 0),
  },
  {
    id: "o4",
    orderNumber: "LR-240410",
    createdAt: "2026-04-22T15:05:00.000Z",
    status: "tamamlandi",
    paymentStatus: "odendi",
    shippingStatus: "teslim-edildi",
    customer: {
      firstName: "Dila",
      lastName: "Demir",
      email: "dila@example.com",
      phone: "+90 555 444 55 66",
      city: "Bursa",
      district: "Nilufer",
      address: "Odunluk Mahallesi Lefkosha Caddesi No: 6",
    },
    items: [
      {
        id: "oi-5",
        productId: "p5",
        productName: "Luks Push-Up Sutyen",
        productSlug: "luks-push-up-sutyen",
        image: adminProducts[4].images[0],
        unitPrice: 1190,
        quantity: 1,
        color: "Pudra",
        size: "80B",
      },
      {
        id: "oi-6",
        productId: "p4",
        productName: "Klasik Brazilian Kulot",
        productSlug: "klasik-brazilian-kulot",
        image: adminProducts[3].images[0],
        unitPrice: 290,
        quantity: 2,
        color: "Beyaz",
        size: "S",
      },
    ],
    subtotal: 1770,
    shippingFee: 0,
    discount: 100,
    total: buildOrderTotal(1770, 0, 100),
  },
  {
    id: "o5",
    orderNumber: "LR-240401",
    createdAt: "2026-04-21T11:50:00.000Z",
    status: "iptal-edildi",
    paymentStatus: "iade-edildi",
    shippingStatus: "hazirlaniyor",
    customer: {
      firstName: "Elif",
      lastName: "Oz",
      email: "elif@example.com",
      phone: "+90 555 777 88 99",
      city: "Adana",
      district: "Seyhan",
      address: "Gazipasa Mahallesi 61012 Sokak No: 18",
    },
    items: [
      {
        id: "oi-7",
        productId: "p8",
        productName: "Dantel Detayli Body",
        productSlug: "dantel-detayli-body",
        image: adminProducts[7].images[0],
        unitPrice: 1890,
        quantity: 1,
        color: "Siyah",
        size: "M",
      },
    ],
    subtotal: 1890,
    shippingFee: 0,
    discount: 0,
    total: 1890,
    note: "Musteri beden degisikligi yerine iptal talep etti.",
  },
];

export const adminSettings: AdminSettings = {
  storeName: "Luna Rosa Admin",
  supportEmail: "destek@lunarosa.com.tr",
  supportPhone: "+90 212 000 00 00",
  whatsappNumber: "905550000000",
  address: "Nisantasi, Sisli / Istanbul",
  freeShippingLimit: 300,
  taxRate: 20,
  instagramUrl: "https://instagram.com/lunarosa",
  cargoLeadTime: "1-3 is gunu",
  maintenanceMode: false,
};

export function getAdminProductById(id: string) {
  return adminProducts.find((product) => product.id === id);
}

export function getAdminOrderById(id: string) {
  return adminOrders.find((order) => order.id === id);
}
