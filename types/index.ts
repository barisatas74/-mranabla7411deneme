export type ProductCategorySlug =
  | "sutyenler"
  | "kulotlar"
  | "takimlar"
  | "gecelikler"
  | "sortlu-takimlar"
  | "spor";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategorySlug;
  price: number;
  oldPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  description: string;
  isFeatured?: boolean;
  isNew?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: ProductCategorySlug;
  image: string;
  tagline?: string;
};

export type ProductFilter = "all" | "new" | "sale";

export type ProductSort = "featured" | "new" | "price-asc" | "price-desc";

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
};

export type CartLine = CartItem & {
  product: Product;
};

export type ShippingMethod = "standard" | "express";

export type PaymentMethod = "card" | "transfer" | "cod";

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  cardHolderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  customerNote: string;
  acceptTerms: boolean;
};

export type CheckoutFieldErrors = Partial<
  Record<keyof CheckoutFormData, string>
>;

export type AdminRecordStatus = "active" | "passive";

export type AdminProduct = Product & {
  sku: string;
  status: AdminRecordStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductInput = {
  name: string;
  slug: string;
  category: ProductCategorySlug;
  price: number;
  oldPrice?: number;
  description: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  status: AdminRecordStatus;
};

export type AdminCategory = Omit<Category, "slug"> & {
  slug: string;
  status: AdminRecordStatus;
  description?: string;
};

export type AdminCategoryInput = {
  name: string;
  slug: string;
  image: string;
  tagline?: string;
  description?: string;
  status: AdminRecordStatus;
};

export type OrderStatus =
  | "beklemede"
  | "hazirlaniyor"
  | "kargoya-verildi"
  | "tamamlandi"
  | "iptal-edildi";

export type PaymentStatus = "bekleniyor" | "odendi" | "iade-edildi";

export type ShippingStatus =
  | "hazirlaniyor"
  | "paketlendi"
  | "yolda"
  | "teslim-edildi";

export type AdminOrderCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
};

export type AdminOrderItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  unitPrice: number;
  quantity: number;
  color: string;
  size: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  customer: AdminOrderCustomer;
  items: AdminOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  note?: string;
};

export type AdminOrderStatusUpdate = Pick<
  AdminOrder,
  "status" | "paymentStatus" | "shippingStatus"
>;

export type AdminSettings = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  address: string;
  freeShippingLimit: number;
  taxRate: number;
  instagramUrl: string;
  cargoLeadTime: string;
  maintenanceMode: boolean;
};

export type AdminDashboardData = {
  metrics: {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  recentOrders: AdminOrder[];
  lowStockProducts: AdminProduct[];
};

export type AdminProductFormValues = {
  name: string;
  slug: string;
  category: ProductCategorySlug;
  price: string;
  oldPrice: string;
  description: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: string;
  isFeatured: boolean;
  isNew: boolean;
  status: AdminRecordStatus;
};

export type AdminCategoryFormValues = {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  status: AdminRecordStatus;
};

export type AdminSettingsFormValues = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  address: string;
  freeShippingLimit: string;
  taxRate: string;
  instagramUrl: string;
  cargoLeadTime: string;
  maintenanceMode: boolean;
};
