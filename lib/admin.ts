import {
  AdminCategory,
  AdminCategoryFormValues,
  AdminOrder,
  AdminProduct,
  AdminProductFormValues,
  AdminSettingsFormValues,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from "@/types";

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "beklemede", label: "Beklemede" },
  { value: "hazirlaniyor", label: "Hazirlaniyor" },
  { value: "kargoya-verildi", label: "Kargoya Verildi" },
  { value: "tamamlandi", label: "Tamamlandi" },
  { value: "iptal-edildi", label: "Iptal Edildi" },
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "bekleniyor", label: "Bekleniyor" },
  { value: "odendi", label: "Odendi" },
  { value: "iade-edildi", label: "Iade Edildi" },
];

export const SHIPPING_STATUS_OPTIONS: { value: ShippingStatus; label: string }[] = [
  { value: "hazirlaniyor", label: "Hazirlaniyor" },
  { value: "paketlendi", label: "Paketlendi" },
  { value: "yolda", label: "Yolda" },
  { value: "teslim-edildi", label: "Teslim Edildi" },
];

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getDashboardMetrics(
  adminProducts: AdminProduct[],
  adminOrders: AdminOrder[]
) {
  const totalRevenue = adminOrders
    .filter((order) => order.paymentStatus === "odendi")
    .reduce((total, order) => total + order.total, 0);

  return {
    totalProducts: adminProducts.length,
    totalOrders: adminOrders.length,
    pendingOrders: adminOrders.filter((order) => order.status === "beklemede").length,
    totalRevenue,
  };
}

export function getLowStockProducts(adminProducts: AdminProduct[], threshold = 10) {
  return adminProducts
    .filter((product) => product.stock <= threshold && product.status === "active")
    .sort((left, right) => left.stock - right.stock);
}

export function getRecentOrders(adminOrders: AdminOrder[], limit = 5) {
  return [...adminOrders]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, limit);
}

export function validateProductForm(values: AdminProductFormValues) {
  const errors: Partial<Record<keyof AdminProductFormValues, string>> = {};

  if (values.name.trim().length < 3) {
    errors.name = "Urun adi en az 3 karakter olmali.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Slug zorunludur.";
  }

  if (!Number.isFinite(Number(values.price)) || Number(values.price) <= 0) {
    errors.price = "Gecerli bir fiyat girin.";
  }

  if (values.oldPrice && Number(values.oldPrice) < Number(values.price)) {
    errors.oldPrice = "Indirimli fiyat normal fiyattan dusuk olmamali.";
  }

  if (values.description.trim().length < 20) {
    errors.description = "Aciklama en az 20 karakter olmali.";
  }

  if (values.images.length === 0) {
    errors.images = "En az bir gorsel baglantisi ekleyin.";
  }

  if (values.colors.length === 0) {
    errors.colors = "En az bir renk tanimi ekleyin.";
  }

  if (values.sizes.length === 0) {
    errors.sizes = "En az bir beden girin.";
  }

  if (!Number.isFinite(Number(values.stock)) || Number(values.stock) < 0) {
    errors.stock = "Stok negatif olamaz.";
  }

  return errors;
}

export function getStockState(stock: number) {
  if (stock <= 0) {
    return "out";
  }

  if (stock <= 10) {
    return "low";
  }

  return "in";
}

export function validateCategoryForm(values: AdminCategoryFormValues) {
  const errors: Partial<Record<keyof AdminCategoryFormValues, string>> = {};

  if (values.name.trim().length < 2) {
    errors.name = "Kategori adi en az 2 karakter olmali.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Slug zorunludur.";
  }

  if (!/^https?:\/\//.test(values.image.trim())) {
    errors.image = "Gecerli bir gorsel baglantisi girin.";
  }

  if (values.description.trim().length < 10) {
    errors.description = "Kisa bir kategori aciklamasi yazin.";
  }

  return errors;
}

export function validateSettingsForm(values: AdminSettingsFormValues) {
  const errors: Partial<Record<keyof AdminSettingsFormValues, string>> = {};

  if (values.storeName.trim().length < 3) {
    errors.storeName = "Magaza adi en az 3 karakter olmali.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.supportEmail.trim())) {
    errors.supportEmail = "Gecerli bir e-posta girin.";
  }

  if (values.supportPhone.trim().length < 10) {
    errors.supportPhone = "Gecerli bir telefon girin.";
  }

  if (values.whatsappNumber.replace(/\D/g, "").length < 10) {
    errors.whatsappNumber = "WhatsApp numarasi eksik.";
  }

  if (values.address.trim().length < 10) {
    errors.address = "Adres bilgisini detaylandirin.";
  }

  if (!Number.isFinite(Number(values.freeShippingLimit))) {
    errors.freeShippingLimit = "Gecerli bir limit girin.";
  }

  if (!Number.isFinite(Number(values.taxRate))) {
    errors.taxRate = "Vergi orani sayisal olmali.";
  }

  if (!/^https?:\/\//.test(values.instagramUrl.trim())) {
    errors.instagramUrl = "Instagram adresi https ile baslamali.";
  }

  if (values.cargoLeadTime.trim().length < 3) {
    errors.cargoLeadTime = "Teslim suresini belirtin.";
  }

  return errors;
}

export function getCategoryProductCount(
  category: AdminCategory,
  adminProducts: AdminProduct[]
) {
  return adminProducts.filter((product) => product.category === category.slug).length;
}
