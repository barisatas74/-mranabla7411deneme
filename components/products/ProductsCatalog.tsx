"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import {
  filterProducts,
  getAvailableColors,
  getAvailableSizes,
} from "@/data/products";
import { getProductPriceBounds } from "@/lib/commerce";
import { cn, formatPrice } from "@/lib/utils";
import { AdminCategory, Product, ProductFilter, ProductSort } from "@/types";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

type CategoryTab = string;

type ProductsCatalogProps = {
  initialCategory: CategoryTab;
  initialFilter: ProductFilter;
  initialSort: ProductSort;
  products: Product[];
  categories: AdminCategory[];
};

const filterOptions: { label: string; value: ProductFilter }[] = [
  { label: "Tüm Ürünler", value: "all" },
  { label: "Yeni Gelenler", value: "new" },
  { label: "İndirimdekiler", value: "sale" },
];

export default function ProductsCatalog({
  initialCategory,
  initialFilter,
  initialSort,
  products,
  categories,
}: ProductsCatalogProps) {
  const priceBounds = useMemo(() => getProductPriceBounds(products), [products]);
  const allSizes = useMemo(() => getAvailableSizes(products), [products]);
  const allColors = useMemo(() => getAvailableColors(products), [products]);
  const [activeCategory, setActiveCategory] = useState<CategoryTab>(initialCategory);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>(initialFilter);
  const [sort, setSort] = useState<ProductSort>(initialSort);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(String(priceBounds.min));
  const [priceMax, setPriceMax] = useState(String(priceBounds.max));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveFilter(initialFilter);
    setSort(initialSort);
  }, [initialCategory, initialFilter, initialSort]);

  useEffect(() => {
    setPriceMin(String(priceBounds.min));
    setPriceMax(String(priceBounds.max));
  }, [priceBounds.max, priceBounds.min]);

  const filteredProducts = useMemo(
    () =>
      filterProducts({
        category: activeCategory,
        filter: activeFilter,
        sort,
        query: deferredSearchQuery,
        sizes: selectedSizes,
        colors: selectedColors,
        minPrice: parsePriceInput(priceMin, priceBounds.min),
        maxPrice: parsePriceInput(priceMax, priceBounds.max),
        products,
      }),
    [
      activeCategory,
      activeFilter,
      deferredSearchQuery,
      priceMax,
      priceMin,
      priceBounds.max,
      priceBounds.min,
      products,
      selectedColors,
      selectedSizes,
      sort,
    ]
  );

  const activeFacetCount =
    selectedSizes.length +
    selectedColors.length +
    Number(searchQuery.trim().length > 0) +
    Number(priceMin !== String(priceBounds.min) || priceMax !== String(priceBounds.max));

  function toggleSelection(
    currentValues: string[],
    nextValue: string,
    setter: (values: string[]) => void
  ) {
    setter(
      currentValues.includes(nextValue)
        ? currentValues.filter((value) => value !== nextValue)
        : [...currentValues, nextValue]
    );
  }

  function clearFacetFilters() {
    setSearchQuery("");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceMin(String(priceBounds.min));
    setPriceMax(String(priceBounds.max));
  }

  function resetAllFilters() {
    setActiveCategory("all");
    setActiveFilter("all");
    setSort("featured");
    clearFacetFilters();
  }

  const activeCategoryName =
    activeCategory === "all"
      ? "Tüm Ürünler"
      : categories.find((category) => category.slug === activeCategory)?.name ??
        "Koleksiyon";
  const activeFilterLabel =
    filterOptions.find((option) => option.value === activeFilter)?.label ??
    "Tüm Ürünler";

  return (
    <>
      <Breadcrumb items={[{ label: "Koleksiyon" }]} />

      <section className="relative overflow-hidden border-b border-ink-900/8 bg-gradient-to-br from-powder-100 via-bone-50 to-white py-8 md:py-10">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_70%_35%,rgba(238,42,139,0.12),transparent_48%)] md:block" />

        <Container className="relative">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <span className="luxe-label plain text-rose-600">La Boutique</span>
              <h1 className="mt-3 font-display text-[38px] leading-[1.02] text-ink-900 md:text-[64px]">
                {activeCategoryName === "Tüm Ürünler" ? (
                  <>
                    Tüm{" "}
                    <span className="font-italic-display text-gradient-fuchsia">
                      Ürünler
                    </span>
                  </>
                ) : (
                  <span className="font-italic-display text-gradient-fuchsia">
                    {activeCategoryName}
                  </span>
                )}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-700 md:text-base">
                Beden, renk ve fiyatı hızlıca süzün; aradığınız parçaya daha az
                adımda ulaşın.
              </p>
            </div>

            <div className="grid grid-cols-3 border border-ink-900/10 bg-white/85 shadow-card backdrop-blur">
              <HeroStat label="Ürün" value={String(filteredProducts.length)} />
              <HeroStat label="Seçim" value={activeFilterLabel} />
              <HeroStat
                label="Aralık"
                value={`${formatPrice(priceBounds.min)}+`}
              />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-6 md:py-9">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside
            className={cn(
              "h-fit border border-ink-900/10 bg-white p-5 shadow-card md:p-6 lg:sticky lg:top-28 lg:block",
              filtersOpen ? "block" : "hidden"
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-ink-900/10 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-rose-600" />
                <p className="text-sm font-medium uppercase tracking-editorial text-ink-900">
                  Filtreler
                </p>
              </div>
              {activeFacetCount > 0 && (
                <button
                  type="button"
                  onClick={clearFacetFilters}
                  className="text-[10px] uppercase tracking-editorial text-rose-600 transition hover:text-rose-700"
                >
                  Temizle
                </button>
              )}
            </div>

            <div className="mt-5 space-y-6">
              <FacetSection title="Beden">
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <FilterChip
                      key={size}
                      label={size}
                      active={selectedSizes.includes(size)}
                      onClick={() =>
                        toggleSelection(selectedSizes, size, setSelectedSizes)
                      }
                    />
                  ))}
                </div>
              </FacetSection>

              <FacetSection title="Renk">
                <div className="flex flex-wrap gap-2">
                  {allColors.map((color) => (
                    <FilterChip
                      key={color}
                      label={color}
                      active={selectedColors.includes(color)}
                      onClick={() =>
                        toggleSelection(selectedColors, color, setSelectedColors)
                      }
                    />
                  ))}
                </div>
              </FacetSection>

              <FacetSection title="Fiyat Aralığı">
                <div className="grid grid-cols-2 gap-3">
                  <PriceInput
                    label="Min"
                    value={priceMin}
                    onChange={setPriceMin}
                    min={priceBounds.min}
                    max={priceBounds.max}
                  />
                  <PriceInput
                    label="Max"
                    value={priceMax}
                    onChange={setPriceMax}
                    min={priceBounds.min}
                    max={priceBounds.max}
                  />
                </div>
                <p className="mt-2 text-[11px] text-ink-600">
                  Aralık: {formatPrice(priceBounds.min)} - {formatPrice(priceBounds.max)}
                </p>
              </FacetSection>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="border border-ink-900/10 bg-white p-4 shadow-card md:p-5">
              <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_auto] xl:items-center">
                <div className="flex items-center gap-3 border border-ink-900/12 bg-bone-50 px-4 py-3">
                  <Search size={16} className="flex-shrink-0 text-rose-600" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Ürün, kategori veya renk ara"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-500"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-[auto_1fr] xl:grid-cols-[auto_auto]">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((current) => !current)}
                    className="flex items-center justify-center gap-2 border border-ink-900/12 px-4 py-3 text-[10px] uppercase tracking-editorial text-ink-900 transition hover:border-rose-600 hover:text-rose-600 lg:hidden"
                    aria-expanded={filtersOpen}
                  >
                    <SlidersHorizontal size={14} />
                    Filtre
                    {activeFacetCount > 0 && (
                      <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[9px] text-white">
                        {activeFacetCount}
                      </span>
                    )}
                  </button>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value as ProductSort)}
                      className="h-full w-full cursor-pointer appearance-none border border-ink-900/12 bg-white py-3 pl-4 pr-10 text-[10px] uppercase tracking-editorial text-ink-900 outline-none transition focus:border-rose-600 sm:min-w-[190px]"
                    >
                      <option value="featured">Öne Çıkanlar</option>
                      <option value="new">Yeni Gelenler</option>
                      <option value="price-asc">Fiyat: Artan</option>
                      <option value="price-desc">Fiyat: Azalan</option>
                    </select>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-700"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <FilterPill
                  label="Tümü"
                  count={products.length}
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                />
                {categories.map((category) => {
                  const count = products.filter(
                    (product) => product.category === category.slug
                  ).length;

                  return (
                    <FilterPill
                      key={category.id}
                      label={category.name}
                      count={count}
                      active={activeCategory === category.slug}
                      onClick={() => setActiveCategory(category.slug)}
                    />
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-ink-900/8 pt-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setActiveFilter(option.value)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-[10px] uppercase tracking-editorial transition",
                        activeFilter === option.value
                          ? "border-ink-950 bg-ink-950 text-white"
                          : "border-ink-900/15 text-ink-700 hover:border-ink-900"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-editorial text-ink-600 transition hover:text-rose-600"
                >
                  <X size={12} />
                  Tümünü Sıfırla
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-[10px] uppercase tracking-editorial text-ink-600">
                {filteredProducts.length} ürün gösteriliyor
              </p>
              {activeFacetCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSizes.map((size) => (
                    <ActiveFacet
                      key={`size-${size}`}
                      label={`Beden: ${size}`}
                      onRemove={() =>
                        setSelectedSizes((current) =>
                          current.filter((value) => value !== size)
                        )
                      }
                    />
                  ))}
                  {selectedColors.map((color) => (
                    <ActiveFacet
                      key={`color-${color}`}
                      label={`Renk: ${color}`}
                      onRemove={() =>
                        setSelectedColors((current) =>
                          current.filter((value) => value !== color)
                        )
                      }
                    />
                  ))}
                  {searchQuery.trim().length > 0 && (
                    <ActiveFacet label={`Arama: ${searchQuery}`} onRemove={() => setSearchQuery("")} />
                  )}
                </div>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-4 md:gap-x-6 md:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-ink-900/10 bg-bone-100 px-6 py-14 text-center md:px-10">
                <p className="font-display text-3xl text-ink-900">Sonuç bulunamadı</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700">
                  Arama ifadesi veya seçili filtreler bu katalogda eşleşmedi. Tüm
                  filtreleri sıfırlayıp yeniden deneyebilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="btn-luxe btn-luxe-dark mt-6"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap border px-4 py-2.5 text-[10.5px] uppercase tracking-editorial transition-all duration-300 md:px-5",
        active
          ? "border-ink-950 bg-ink-950 text-white"
          : "border-ink-900/15 text-ink-700 hover:border-ink-900 hover:text-ink-900"
      )}
    >
      {label}
      <span className={cn("text-[9px]", active ? "text-white/50" : "text-ink-500")}>
        {count}
      </span>
    </button>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-r border-ink-900/8 px-4 py-4 text-center last:border-r-0">
      <p className="text-[9px] uppercase tracking-editorial text-ink-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-ink-900">
        {value}
      </p>
    </div>
  );
}

function FacetSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[11px] uppercase tracking-editorial text-ink-700">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-2 text-[11px] transition",
        active
          ? "border-ink-950 bg-ink-950 text-white"
          : "border-ink-900/12 text-ink-700 hover:border-ink-900"
      )}
    >
      {label}
    </button>
  );
}

function ActiveFacet({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full bg-powder-100 px-3 py-2 text-[10px] uppercase tracking-editorial text-ink-900"
    >
      {label}
      <X size={12} />
    </button>
  );
}

function PriceInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-editorial text-ink-500">
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full border border-ink-900/12 bg-bone-50 px-3 py-2.5 text-sm outline-none transition focus:border-ink-900"
      />
    </label>
  );
}

function parsePriceInput(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
