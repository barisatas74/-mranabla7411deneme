"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/categories";
import {
  filterProducts,
  getAvailableColors,
  getAvailableSizes,
  products,
} from "@/data/products";
import { getProductPriceBounds } from "@/lib/commerce";
import { cn, formatPrice } from "@/lib/utils";
import { ProductCategorySlug, ProductFilter, ProductSort } from "@/types";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

type CategoryTab = ProductCategorySlug | "all";

type ProductsCatalogProps = {
  initialCategory: CategoryTab;
  initialFilter: ProductFilter;
  initialSort: ProductSort;
};

const filterOptions: { label: string; value: ProductFilter }[] = [
  { label: "Tum Urunler", value: "all" },
  { label: "Yeni Gelenler", value: "new" },
  { label: "Indirimdekiler", value: "sale" },
];

const priceBounds = getProductPriceBounds(products);
const allSizes = getAvailableSizes(products);
const allColors = getAvailableColors(products);

export default function ProductsCatalog({
  initialCategory,
  initialFilter,
  initialSort,
}: ProductsCatalogProps) {
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
      }),
    [
      activeCategory,
      activeFilter,
      deferredSearchQuery,
      priceMax,
      priceMin,
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

  return (
    <>
      <Breadcrumb items={[{ label: "Koleksiyon" }]} />

      <section className="relative overflow-hidden bg-gradient-to-b from-powder-100 via-bone-50 to-bone-50 py-10 md:py-16">
        <span className="pointer-events-none absolute right-6 top-0 hidden select-none font-italic-display text-[180px] leading-none text-rose-600/5 md:block">
          Boutique
        </span>

        <Container className="relative text-center">
          <span className="luxe-label">La Boutique</span>
          <h1 className="mt-4 font-display text-[36px] leading-[1.04] text-ink-900 md:mt-5 md:text-[78px] md:leading-none">
            Tum <span className="font-italic-display text-rose-600">Urunler</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-700 md:mt-5 md:text-base">
            Arama, fiyat araligi, beden ve renk filtreleri ile koleksiyonu gercek
            bir magaza akisi gibi tarayin.
          </p>
        </Container>
      </section>

      <Container className="py-7 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="flex w-full items-center justify-between border border-ink-900/12 bg-white px-4 py-3.5 text-left shadow-card"
              aria-expanded={filtersOpen}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-editorial text-ink-900">
                <SlidersHorizontal size={15} className="text-rose-600" />
                Filtreler
                {activeFacetCount > 0 && (
                  <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[9px] text-white">
                    {activeFacetCount}
                  </span>
                )}
              </span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={cn(
                  "text-ink-700 transition-transform",
                  filtersOpen && "rotate-180"
                )}
              />
            </button>
          </div>

          <aside
            className={cn(
              "h-fit border border-ink-900/10 bg-white p-5 shadow-card md:p-6 lg:sticky lg:top-28 lg:block lg:rounded-[28px]",
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
              <div>
                <label className="text-[11px] uppercase tracking-editorial text-ink-700">
                  Arama
                </label>
                <div className="mt-2 flex items-center gap-3 border border-ink-900/12 bg-bone-50 px-4 py-3">
                  <Search size={15} className="text-ink-500" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Urun, kategori veya renk ara"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-500"
                  />
                </div>
              </div>

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

              <FacetSection title="Fiyat Araligi">
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
                  Aralik: {formatPrice(priceBounds.min)} - {formatPrice(priceBounds.max)}
                </p>
              </FacetSection>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-5 border-b border-ink-900/10 pb-8">
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar md:mx-0 md:px-1">
                <FilterPill
                  label="Tumu"
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

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setActiveFilter(option.value)}
                      className={cn(
                        "rounded-full border px-3 py-2 text-center text-[10px] uppercase tracking-editorial transition sm:px-4",
                        activeFilter === option.value
                          ? "border-ink-950 bg-ink-950 text-white"
                          : "border-ink-900/15 text-ink-700 hover:border-ink-900"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center md:self-auto">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center justify-center gap-2 border border-ink-900/10 px-4 py-2.5 text-[10px] uppercase tracking-editorial text-ink-700 transition hover:text-rose-600 sm:border-0 sm:px-0 sm:py-0"
                  >
                    <X size={12} />
                    Tumunu Sifirla
                  </button>
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value as ProductSort)}
                      className="w-full cursor-pointer appearance-none border border-ink-900/15 bg-transparent py-2.5 pl-4 pr-9 text-[11px] uppercase tracking-editorial outline-none focus:border-ink-900 sm:w-auto"
                    >
                      <option value="featured">One Cikanlar</option>
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
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-[10px] uppercase tracking-editorial text-ink-600">
                {filteredProducts.length} urun gosteriliyor
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
                <p className="font-display text-3xl text-ink-900">Sonuc bulunamadi</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700">
                  Arama ifadesi veya secili filtreler bu katalogda eslesmedi. Tum
                  filtreleri sifirlayip yeniden deneyebilirsiniz.
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
