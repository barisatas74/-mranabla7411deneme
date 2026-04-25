"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useCart } from "@/components/CartContext";
import Container from "@/components/Container";
import { WhatsAppSupportButton } from "@/components/WhatsAppButton";
import {
  getCartSummary,
  PAYMENT_METHODS,
  SHIPPING_METHODS,
} from "@/lib/commerce";
import { cn, formatPrice } from "@/lib/utils";
import {
  CheckoutFieldErrors,
  CheckoutFormData,
  PaymentMethod,
  ShippingMethod,
} from "@/types";
import { CheckCircle2, CreditCard, Lock, Truck, Wallet } from "lucide-react";

const initialFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  district: "",
  address: "",
  postalCode: "",
  shippingMethod: "standard",
  paymentMethod: "card",
  cardHolderName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  customerNote: "",
  acceptTerms: false,
};

type PlacedOrder = {
  orderNumber: string;
  summary: ReturnType<typeof getCartSummary>;
  customerName: string;
  lines: ReturnType<typeof useCart>["lines"];
};

export default function CheckoutPage() {
  const { lines, couponCode, clearCart, isHydrated } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const summary = useMemo(
    () =>
      getCartSummary(lines, {
        couponCode,
        shippingMethod: formData.shippingMethod,
      }),
    [couponCode, formData.shippingMethod, lines]
  );

  function updateField<K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K]
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validateFields(fields: (keyof CheckoutFormData)[]) {
    const validationErrors: CheckoutFieldErrors = {};

    for (const field of fields) {
      const error = validateField(field, formData);
      if (error) {
        validationErrors[field] = error;
      }
    }

    setErrors((current) => ({ ...current, ...validationErrors }));
    return Object.keys(validationErrors).length === 0;
  }

  function handleContinueToShipping() {
    const isValid = validateFields([
      "firstName",
      "lastName",
      "email",
      "phone",
      "city",
      "district",
      "address",
      "postalCode",
    ]);

    if (isValid) {
      setStep(2);
    }
  }

  function handleContinueToPayment() {
    const isValid = validateFields(["shippingMethod"]);

    if (isValid) {
      setStep(3);
    }
  }

  function handlePlaceOrder() {
    const fieldsToValidate: (keyof CheckoutFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "city",
      "district",
      "address",
      "postalCode",
      "shippingMethod",
      "paymentMethod",
      "acceptTerms",
    ];

    if (formData.paymentMethod === "card") {
      fieldsToValidate.push("cardHolderName", "cardNumber", "cardExpiry", "cardCvc");
    }

    const isValid = validateFields(fieldsToValidate);

    if (!isValid) {
      setStep(3);
      return;
    }

    const order: PlacedOrder = {
      orderNumber: `LR-${Date.now().toString().slice(-6)}`,
      summary,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      lines,
    };

    setPlacedOrder(order);
    clearCart();
  }

  if (!isHydrated) {
    return (
      <>
        <Breadcrumb items={[{ label: "Sepetim", href: "/cart" }, { label: "Odeme" }]} />
        <Container className="py-20 md:py-24">
          <div className="mx-auto max-w-3xl animate-pulse space-y-4">
            <div className="h-8 w-56 bg-bone-100" />
            <div className="h-40 bg-bone-100" />
            <div className="h-40 bg-bone-100" />
          </div>
        </Container>
      </>
    );
  }

  if (placedOrder) {
    return (
      <>
        <Breadcrumb items={[{ label: "Sepetim", href: "/cart" }, { label: "Siparis Onayi" }]} />
        <Container className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-ink-900/10 bg-white p-8 shadow-card md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white">
              <CheckCircle2 size={28} />
            </div>
            <p className="mt-6 text-center text-[11px] uppercase tracking-editorial text-rose-600">
              Siparis Alindi
            </p>
            <h1 className="mt-3 text-center font-display text-4xl text-ink-900 md:text-5xl">
              Tesekkurler, {placedOrder.customerName}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-ink-700 md:text-base">
              Siparis numaraniz <span className="font-medium text-ink-900">{placedOrder.orderNumber}</span>.
              Bu onay ekrani frontend simulasyonudur; backend ve odeme entegrasyonu
              olmadan demo akisi tamamlandi.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-4">
                {placedOrder.lines.map((line) => (
                  <div key={line.id} className="flex gap-3 border-b border-ink-900/8 pb-4">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-bone-100">
                      <Image
                        src={line.product.images[0]}
                        alt={line.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-tight text-ink-900">
                        {line.product.name}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-600">
                        {line.color} / Beden {line.size} / Adet {line.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-ink-900">
                      {formatPrice(line.product.price * line.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-fit rounded-[28px] border border-ink-900/10 bg-bone-50 p-6">
                <p className="luxe-label plain text-rose-600">Siparis Ozeti</p>
                <div className="mt-5 space-y-3 text-sm">
                  <SummaryRow
                    label="Ara Toplam"
                    value={formatPrice(placedOrder.summary.subtotal)}
                  />
                  <SummaryRow
                    label="Kargo"
                    value={formatPrice(placedOrder.summary.shipping)}
                  />
                  {placedOrder.summary.discount > 0 && (
                    <SummaryRow
                      label="Indirim"
                      value={`-${formatPrice(placedOrder.summary.discount)}`}
                      accent
                    />
                  )}
                  <div className="border-t border-ink-900/10 pt-4">
                    <SummaryRow
                      label="Toplam"
                      value={formatPrice(placedOrder.summary.total)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/products" className="btn-luxe btn-luxe-dark">
                Alisverise Devam Et
              </Link>
            </div>
          </div>
        </Container>
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "Sepetim", href: "/cart" }, { label: "Odeme" }]} />
        <Container className="py-20 text-center">
          <h1 className="font-display text-4xl text-ink-900 md:text-5xl">
            Odeme icin sepetiniz bos
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-700 md:text-base">
            Once sepete urun ekleyin, sonra musteri bilgileri ve kargo secimi ile
            odeme adimina gecebilirsiniz.
          </p>
          <Link href="/products" className="btn-luxe btn-luxe-dark mt-8">
            Koleksiyona Don
          </Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Sepetim", href: "/cart" }, { label: "Odeme" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-10 text-center md:py-14">
        <Container>
          <span className="luxe-label">Paiement Securise</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[60px]">
            Odeme
          </h1>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-luxe md:gap-4">
            {[
              { n: 1, label: "Teslimat" },
              { n: 2, label: "Kargo" },
              { n: 3, label: "Odeme" },
            ].map((item, index) => (
              <div key={item.n} className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs",
                      step >= item.n
                        ? "bg-ink-900 text-white"
                        : "border border-ink-900/20 bg-white text-ink-700/60"
                    )}
                  >
                    {step > item.n ? <CheckCircle2 size={14} /> : item.n}
                  </span>
                  <span className={step >= item.n ? "text-ink-900" : "text-ink-700/50"}>
                    {item.label}
                  </span>
                </div>
                {index < 2 && <span className="h-px w-6 bg-ink-900/20 md:w-10" />}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Section n={1} title="Musteri Bilgileri" active={step === 1}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Ad"
                value={formData.firstName}
                onChange={(value) => updateField("firstName", value)}
                error={errors.firstName}
              />
              <FormInput
                label="Soyad"
                value={formData.lastName}
                onChange={(value) => updateField("lastName", value)}
                error={errors.lastName}
              />
              <FormInput
                label="E-posta"
                type="email"
                value={formData.email}
                onChange={(value) => updateField("email", value)}
                error={errors.email}
              />
              <FormInput
                label="Telefon"
                value={formData.phone}
                onChange={(value) => updateField("phone", value)}
                error={errors.phone}
              />
              <FormInput
                label="Adres"
                className="md:col-span-2"
                value={formData.address}
                onChange={(value) => updateField("address", value)}
                error={errors.address}
              />
              <FormInput
                label="Il"
                value={formData.city}
                onChange={(value) => updateField("city", value)}
                error={errors.city}
              />
              <FormInput
                label="Ilce"
                value={formData.district}
                onChange={(value) => updateField("district", value)}
                error={errors.district}
              />
              <FormInput
                label="Posta Kodu"
                value={formData.postalCode}
                onChange={(value) => updateField("postalCode", value)}
                error={errors.postalCode}
              />
            </div>
            <label className="mt-5 block">
              <span className="text-[11px] uppercase tracking-luxe text-ink-700">
                Siparis Notu
              </span>
              <textarea
                value={formData.customerNote}
                onChange={(event) => updateField("customerNote", event.target.value)}
                rows={4}
                className="mt-1.5 w-full border border-ink-900/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-rose-500"
                placeholder="Kargo notu veya teslimat bilgisi ekleyebilirsiniz."
              />
            </label>
            <button
              type="button"
              onClick={handleContinueToShipping}
              className="btn-luxe btn-luxe-dark mt-7 shadow-soft"
            >
              Devam Et
            </button>
          </Section>

          <Section n={2} title="Kargo Secimi" active={step === 2}>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => {
                const shippingPrice = getCartSummary(lines, {
                  couponCode,
                  shippingMethod: method.id,
                }).shipping;

                return (
                  <label
                    key={method.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 border p-4 transition",
                      formData.shippingMethod === method.id
                        ? "border-ink-900 bg-bone-50"
                        : "border-ink-900/10 hover:border-rose-400"
                    )}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={formData.shippingMethod === method.id}
                      onChange={() => updateField("shippingMethod", method.id)}
                      className="accent-rose-600"
                    />
                    <Truck size={18} className="text-rose-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900">{method.label}</p>
                      <p className="text-xs text-ink-700/70">{method.description}</p>
                    </div>
                    <span className="text-sm font-medium">
                      {shippingPrice === 0 ? "Ucretsiz" : formatPrice(shippingPrice)}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.shippingMethod && (
              <p className="mt-3 text-sm text-rose-600">{errors.shippingMethod}</p>
            )}
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-luxe btn-luxe-outline"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={handleContinueToPayment}
                className="btn-luxe btn-luxe-dark shadow-soft"
              >
                Devam Et
              </button>
            </div>
          </Section>

          <Section n={3} title="Odeme Yontemi" active={step === 3}>
            <div className="mb-6 grid gap-3 md:grid-cols-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => updateField("paymentMethod", method.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 border p-4 text-sm tracking-wide transition",
                    formData.paymentMethod === method.id
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-ink-900/15 hover:border-ink-900"
                  )}
                >
                  {method.id === "card" && <CreditCard size={16} />}
                  {method.id === "transfer" && <Wallet size={16} />}
                  {method.id === "cod" && <Truck size={16} />}
                  {method.label}
                </button>
              ))}
            </div>

            {formData.paymentMethod === "card" && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Kart Uzerindeki Isim"
                  className="md:col-span-2"
                  value={formData.cardHolderName}
                  onChange={(value) => updateField("cardHolderName", value)}
                  error={errors.cardHolderName}
                />
                <FormInput
                  label="Kart Numarasi"
                  className="md:col-span-2"
                  value={formData.cardNumber}
                  onChange={(value) => updateField("cardNumber", value)}
                  error={errors.cardNumber}
                />
                <FormInput
                  label="Son Kullanma (AA/YY)"
                  value={formData.cardExpiry}
                  onChange={(value) => updateField("cardExpiry", value)}
                  error={errors.cardExpiry}
                />
                <FormInput
                  label="CVC"
                  value={formData.cardCvc}
                  onChange={(value) => updateField("cardCvc", value)}
                  error={errors.cardCvc}
                />
              </div>
            )}

            <label className="mt-7 flex items-start gap-2.5 text-[12px] leading-relaxed text-ink-700">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(event) => updateField("acceptTerms", event.target.checked)}
                className="mt-1 accent-rose-600"
              />
              <span>
                <Link
                  href="/mesafeli-satis"
                  className="text-rose-600 underline underline-offset-2"
                >
                  Mesafeli Satis Sozlesmesi
                </Link>{" "}
                ile{" "}
                <Link href="/kvkk" className="text-rose-600 underline underline-offset-2">
                  KVKK Aydinlatma Metni
                </Link>{" "}
                metinlerini okudum ve kabul ediyorum.
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-2 text-sm text-rose-600">{errors.acceptTerms}</p>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="btn-luxe btn-luxe-dark mt-7 w-full shadow-luxe"
            >
              <Lock size={13} strokeWidth={1.5} />
              {formatPrice(summary.total)} / Siparisi Tamamla
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-700/60">
              <Lock size={11} /> Backend baglantisi olmadan frontend siparis akisi simule edilir.
            </p>
          </Section>
        </div>

        <aside className="h-fit border border-rose-100/60 bg-white p-6 shadow-card lg:sticky lg:top-28">
          <p className="luxe-label">Siparis Ozeti</p>

          <div className="mt-5 space-y-4">
            {lines.map((line) => (
              <div key={line.id} className="flex gap-3">
                <div className="relative h-20 w-16 flex-shrink-0 bg-powder-50">
                  <Image
                    src={line.product.images[0]}
                    alt={line.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[10px] text-white">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-display text-sm leading-tight text-ink-900">
                    {line.product.name}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-700/60">
                    {line.color} / {line.size}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(line.product.price * line.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-rose-100 pt-5 text-sm">
            <SummaryRow label="Ara Toplam" value={formatPrice(summary.subtotal)} />
            <SummaryRow
              label="Kargo"
              value={summary.shipping === 0 ? "Ucretsiz" : formatPrice(summary.shipping)}
            />
            {summary.discount > 0 && (
              <SummaryRow
                label={`Indirim (${couponCode})`}
                value={`-${formatPrice(summary.discount)}`}
                accent
              />
            )}
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-rose-100 pt-4">
            <span className="font-display text-lg">Toplam</span>
            <span className="font-display text-2xl text-ink-900">
              {formatPrice(summary.total)}
            </span>
          </div>

          <WhatsAppSupportButton
            context="odeme ve siparis surecim"
            className="mt-6"
          />
        </aside>
      </Container>
    </>
  );
}

function Section({
  n,
  title,
  active,
  children,
}: {
  n: number;
  title: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border bg-white p-6 transition md:p-8",
        active ? "border-rose-200 shadow-card" : "border-rose-100/50 opacity-60"
      )}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-sm text-white">
          {n}
        </span>
        <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  error,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[11px] uppercase tracking-luxe text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1.5 w-full border bg-transparent px-4 py-3 text-sm outline-none transition",
          error
            ? "border-rose-500 focus:border-rose-500"
            : "border-ink-900/15 focus:border-rose-500"
        )}
      />
      {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
    </label>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-ink-700">{label}</span>
      <span className={accent ? "font-medium text-rose-600" : "font-medium text-ink-900"}>
        {value}
      </span>
    </div>
  );
}

function validateField(
  field: keyof CheckoutFormData,
  formData: CheckoutFormData
) {
  const trimmedValue =
    typeof formData[field] === "string" ? formData[field].trim() : formData[field];

  switch (field) {
    case "firstName":
    case "lastName":
    case "city":
    case "district":
      return String(trimmedValue).length >= 2
        ? undefined
        : "Bu alan en az 2 karakter olmali.";
    case "address":
      return String(trimmedValue).length >= 10
        ? undefined
        : "Adres bilgisini daha detayli girin.";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(trimmedValue))
        ? undefined
        : "Gecerli bir e-posta girin.";
    case "phone":
      return String(trimmedValue).replace(/\D/g, "").length >= 10
        ? undefined
        : "Gecerli bir telefon numarasi girin.";
    case "postalCode":
      return /^\d{5}$/.test(String(trimmedValue))
        ? undefined
        : "Posta kodu 5 haneli olmali.";
    case "shippingMethod":
      return formData.shippingMethod ? undefined : "Bir kargo secenegi secin.";
    case "paymentMethod":
      return formData.paymentMethod ? undefined : "Bir odeme yontemi secin.";
    case "cardHolderName":
      return formData.paymentMethod !== "card" || String(trimmedValue).length >= 3
        ? undefined
        : "Kart uzerindeki ismi girin.";
    case "cardNumber":
      return formData.paymentMethod !== "card" ||
        String(trimmedValue).replace(/\D/g, "").length === 16
        ? undefined
        : "Kart numarasi 16 haneli olmali.";
    case "cardExpiry":
      return formData.paymentMethod !== "card" ||
        /^(0[1-9]|1[0-2])\/\d{2}$/.test(String(trimmedValue))
        ? undefined
        : "AA/YY formatinda son kullanma tarihi girin.";
    case "cardCvc":
      return formData.paymentMethod !== "card" ||
        /^\d{3,4}$/.test(String(trimmedValue))
        ? undefined
        : "CVC 3 veya 4 haneli olmali.";
    case "acceptTerms":
      return formData.acceptTerms ? undefined : "Devam etmek icin onay vermelisiniz.";
    case "customerNote":
    default:
      return undefined;
  }
}
