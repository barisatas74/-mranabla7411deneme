"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartContext";
import { WhatsAppProductButton } from "@/components/WhatsAppButton";
import {
  getCategoryName,
  getRelatedProducts,
  isProductOnSale,
} from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import {
  ChevronDown,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

type VariantErrors = {
  color?: string;
  size?: string;
};

export default function ProductDetailView({ product }: { product: Product }) {
  const { addItem } = useCart();
  const relatedProducts = useMemo(
    () => getRelatedProducts(product.id, product.category, 4),
    [product.category, product.id]
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("details");
  const [errors, setErrors] = useState<VariantErrors>({});

  const discount = isProductOnSale(product)
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : null;

  async function handleAddToCart() {
    const nextErrors: VariantErrors = {};

    if (!selectedColor) {
      nextErrors.color = "Devam etmek icin bir renk secin.";
    }

    if (!selectedSize) {
      nextErrors.size = "Devam etmek icin bir beden secin.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    addItem({
      product,
      quantity,
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
    });
    setIsAdding(false);
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Koleksiyon", href: "/products" },
          { label: product.name },
        ]}
      />

      <Container className="pb-20">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <div className="grid gap-3 md:grid-cols-[88px_minmax(0,1fr)]">
              <div className="order-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar md:order-1 md:flex-col">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={cn(
                      "relative h-24 w-20 flex-shrink-0 overflow-hidden border bg-bone-100 transition md:h-[120px] md:w-full",
                      index === imageIndex
                        ? "border-rose-600"
                        : "border-ink-900/10 hover:border-ink-900/30"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="order-1 relative aspect-[3/4] overflow-hidden bg-bone-100 shadow-card md:order-2">
                <Image
                  src={product.images[imageIndex]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
                {product.isNew && (
                  <span className="absolute left-4 top-4 bg-bone-50/95 px-3 py-1.5 text-[10px] uppercase tracking-editorial backdrop-blur">
                    Yeni sezon
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <span className="text-[10px] uppercase tracking-editorial text-rose-600">
              {getCategoryName(product.category)}
            </span>
            <h1 className="mt-2 font-display text-[34px] leading-[1.05] text-ink-900 md:text-[48px]">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <span className="font-display text-[30px] text-ink-900 md:text-[36px]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-base text-ink-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {discount && (
                <span className="bg-rose-600 px-2 py-1 text-[10px] uppercase tracking-editorial text-white">
                  -%{discount}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-7 text-ink-700 md:text-[15px]">
              {product.description}
            </p>

            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-[10px] uppercase tracking-editorial text-ink-700">
                  Renk:{" "}
                  <span className="text-ink-900">
                    {selectedColor ?? "Secim yapilmadi"}
                  </span>
                </p>
                <p className="text-[10px] uppercase tracking-editorial text-ink-500">
                  {product.colors.length} secenek
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color.name);
                      setErrors((current) => ({ ...current, color: undefined }));
                    }}
                    aria-label={color.name}
                    aria-pressed={selectedColor === color.name}
                    className={cn(
                      "h-10 w-10 rounded-full transition",
                      selectedColor === color.name
                        ? "scale-105 ring-2 ring-rose-600 ring-offset-2 ring-offset-bone-50"
                        : "ring-1 ring-ink-900/15 hover:ring-ink-900",
                      errors.color && "ring-2 ring-red-400 ring-offset-2 ring-offset-bone-50"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              {errors.color && (
                <p className="mt-2 text-[11px] text-rose-600">{errors.color}</p>
              )}
            </section>

            <section className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-[10px] uppercase tracking-editorial text-ink-700">
                  Beden:{" "}
                  <span className="text-ink-900">
                    {selectedSize ?? "Secim yapilmadi"}
                  </span>
                </p>
                <span className="text-[10px] uppercase tracking-editorial text-rose-600">
                  Stok: {product.stock}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setErrors((current) => ({ ...current, size: undefined }));
                    }}
                    aria-pressed={selectedSize === size}
                    className={cn(
                      "min-w-[56px] border px-3 py-3 text-sm transition",
                      selectedSize === size
                        ? "border-ink-950 bg-ink-950 text-white"
                        : "border-ink-900/15 hover:border-ink-900",
                      errors.size && !selectedSize && "border-rose-600"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.size && (
                <p className="mt-2 text-[11px] text-rose-600">{errors.size}</p>
              )}
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center border border-ink-900/15">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-[52px] w-11 items-center justify-center hover:bg-bone-100"
                  aria-label="Azalt"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.min(product.stock, current + 1))
                  }
                  className="flex h-[52px] w-11 items-center justify-center hover:bg-bone-100"
                  aria-label="Artir"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className="btn-luxe btn-luxe-dark flex-1 shadow-soft disabled:opacity-60"
              >
                {isAdding ? (
                  "Ekleniyor"
                ) : (
                  <>
                    <ShoppingBag strokeWidth={1.5} size={15} />
                    Sepete Ekle
                  </>
                )}
              </button>

            </div>

            {product.stock > 0 && product.stock <= 5 && (
              <p className="mt-4 flex items-center gap-2 text-[11px] tracking-wider text-rose-600">
                <Sparkles size={12} strokeWidth={1.5} />
                Son {product.stock} adet, sinirli stok ve hizli gonderim
              </p>
            )}
            {product.stock === 0 && (
              <p className="mt-4 flex items-center gap-2 text-[11px] tracking-wider text-ink-700">
                <Sparkles size={12} strokeWidth={1.5} />
                Bu urun gecici olarak tukendi.
              </p>
            )}

            <div className="mt-5">
              <WhatsAppProductButton productName={product.name} />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-ink-900/10 pt-8">
              <TrustItem
                icon={<Truck size={18} strokeWidth={1.4} />}
                title="Ucretsiz Kargo"
                subtitle="300 TL uzeri"
              />
              <TrustItem
                icon={<RotateCcw size={18} strokeWidth={1.4} />}
                title="Kolay Iade"
                subtitle="14 gun sure"
              />
              <TrustItem
                icon={<Shield size={18} strokeWidth={1.4} />}
                title="Guvenli Odeme"
                subtitle="256-bit SSL"
              />
            </div>

            <div className="mt-10 border-t border-ink-900/10">
              <DetailAccordion
                id="details"
                title="Urun Detaylari"
                open={openAccordion === "details"}
                onToggle={setOpenAccordion}
              >
                <p>{product.description}</p>
                <ul className="mt-3 list-inside list-disc space-y-1 marker:text-rose-600">
                  <li>Premium kumas ve astar yapisi</li>
                  <li>Butik kesim ve rafine detaylar</li>
                  <li>30 derecede hassas yikama onerilir</li>
                  <li>Turkiye&apos;de uretilmistir</li>
                </ul>
              </DetailAccordion>
              <DetailAccordion
                id="shipping"
                title="Kargo ve Teslimat"
                open={openAccordion === "shipping"}
                onToggle={setOpenAccordion}
              >
                <p>300 TL ve uzeri siparislerde kargo ucretsizdir.</p>
                <p className="mt-2">
                  Siparisler ortalama 1-3 is gunu icinde teslim edilir. Istanbul ici
                  ayni gun teslimat secenekleri kampanya donemlerine gore acilabilir.
                </p>
              </DetailAccordion>
              <DetailAccordion
                id="returns"
                title="Iade ve Degisim"
                open={openAccordion === "returns"}
                onToggle={setOpenAccordion}
              >
                <p>
                  Kullanilmamis ve hijyen etiketi korunmus urunleri 14 gun icinde
                  iade veya degisime gonderebilirsiniz.
                </p>
              </DetailAccordion>
            </div>
          </div>
        </div>
      </Container>

      {relatedProducts.length > 0 && (
        <section className="border-t border-ink-900/5 bg-bone-100/60 py-20 md:py-24">
          <Container>
            <div className="mb-10">
              <span className="luxe-label">Vous aimerez aussi</span>
              <h2 className="mt-3 font-display text-[32px] text-ink-900 md:text-[48px]">
                Benzer <span className="font-italic-display text-rose-600">parcalar</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-12">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function TrustItem({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="text-rose-600">{icon}</span>
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-900">
        {title}
      </p>
      <p className="text-[10px] text-ink-600">{subtitle}</p>
    </div>
  );
}

function DetailAccordion({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-ink-900/10">
      <button
        type="button"
        onClick={() => onToggle(open ? "" : id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[11px] font-medium uppercase tracking-editorial text-ink-900">
          {title}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn("text-ink-700 transition-transform", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity,padding] duration-300",
          open ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-2 text-[13.5px] leading-7 text-ink-700">
          {children}
        </div>
      </div>
    </div>
  );
}
