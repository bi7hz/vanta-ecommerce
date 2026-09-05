"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { products, shopCategories, type ShopCategory, type SortOption } from "@/lib/products";
import { FilterSidebar } from "./FilterSidebar";
import { ProductGrid } from "./ProductGrid";
import { defaultFilters, type CategorySelection, type FilterState } from "./types";

type CategoryCard = { id: CategorySelection; label: string; image: string };

const categoryCards: readonly CategoryCard[] = [
  { id: "all", label: "All", image: "/products/sneakers/product-01.png" },
  { id: "sneakers", label: "Sneakers", image: "/products/sneakers/product-01.png" },
  { id: "t-shirts", label: "T-Shirts", image: "/products/tshirts/vanta-black-contrast-panel-tee/01-product-front.webp" },
  { id: "hoodies", label: "Hoodies", image: "/products/hoodies/vanta-black-graffiti-hoodie/01-lifestyle-front.webp" },
  { id: "pants", label: "Pants", image: "/products/pants/vanta-black-denim-barrel-jeans/01-product-front.webp" },
  { id: "sale", label: "Sale", image: "/products/hoodies/vanta-black-graffiti-hoodie/01-lifestyle-front.webp" },
];

export function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [visible, setVisible] = useState(12);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categoryParam = searchParams.get("category") as ShopCategory | null;
  const saleParam = searchParams.get("sale") === "true";
  const urlCategory: CategorySelection = categoryParam && shopCategories.includes(categoryParam)
    ? categoryParam
    : saleParam
      ? "sale"
      : "all";

  useEffect(() => {
    if (filters.category !== urlCategory || filters.saleOnly !== saleParam) {
      setFilters((current) => ({ ...current, category: urlCategory, saleOnly: saleParam }));
    }
  }, [filters.category, filters.saleOnly, saleParam, urlCategory]);

  const writeUrl = useCallback((next: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("sale");
    if (next.category !== "all" && next.category !== "sale") params.set("category", next.category);
    if (next.saleOnly) params.set("sale", "true");
    router.replace(pathname + (params.size ? "?" + params.toString() : ""), { scroll: false });
  }, [pathname, router, searchParams]);

  const updateFilters = useCallback((next: FilterState) => {
    setFilters(next);
    setVisible(12);
    writeUrl(next);
  }, [writeUrl]);

  const setCategory = (category: CategorySelection) => updateFilters({ ...filters, category, saleOnly: category === "sale" });
  const clearAll = () => {
    setFilters(defaultFilters);
    setSort("featured");
    setVisible(12);
    router.replace(pathname, { scroll: false });
  };

  const filtered = useMemo(() => products.filter((product) => {
    const categoryMatch = filters.category === "all" || filters.category === "sale" || product.category === filters.category;
    const availabilityMatch = filters.availability === "all" || (filters.availability === "in" ? product.stock > 0 : product.stock === 0);
    return categoryMatch
      && (!filters.saleOnly || product.isSale)
      && (!filters.brands.length || filters.brands.includes(product.brand))
      && (!filters.sizes.length || filters.sizes.some((size) => product.sizes.includes(size)))
      && (!filters.colors.length || filters.colors.some((color) => product.colors.includes(color)))
      && product.price >= filters.minPrice
      && product.price <= filters.maxPrice
      && availabilityMatch;
  }), [filters]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sort === "newest") return Number(b.isNew) - Number(a.isNew);
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0;
  }), [filtered, sort]);

  const activeCount = (filters.category === "all" ? 0 : 1)
    + filters.brands.length
    + filters.sizes.length
    + filters.colors.length
    + Number(filters.minPrice > 0 || filters.maxPrice < 300)
    + Number(filters.availability !== "all")
    + Number(filters.saleOnly && filters.category !== "sale");

  return (
    <>
      <CategoryNav active={filters.category} onSelect={setCategory} />
      <section className="shop-catalog" id="shop-catalog">
        <div className="shop-catalog__toolbar">
          <button className="mobile-filter-button" type="button" onClick={() => setDrawerOpen(true)}>
            Filters {activeCount ? <span>{activeCount}</span> : null}
          </button>
          <p><strong>{sorted.length}</strong> products</p>
          <label>Sort by
            <select value={sort} onChange={(event) => { setSort(event.target.value as SortOption); setVisible(12); }}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>
        <div className="shop-catalog__body">
          <FilterSidebar filters={filters} onChange={updateFilters} onClear={clearAll} resultCount={sorted.length} />
          <div className="shop-results">
            {activeCount ? <div className="active-filters"><span>{activeCount} active {activeCount === 1 ? "filter" : "filters"}</span><button type="button" onClick={clearAll}>Reset</button></div> : null}
            {sorted.length ? (
              <>
                <ProductGrid products={sorted.slice(0, visible)} />
                {visible < sorted.length ? <button className="load-more" type="button" onClick={() => setVisible((count) => count + 12)}>Load more products <Arrow /></button> : null}
              </>
            ) : <EmptyState onClear={clearAll} />}
          </div>
        </div>
      </section>
      {drawerOpen ? (
        <div className="filter-drawer" role="dialog" aria-modal="true" aria-label="Product filters">
          <div className="filter-drawer__backdrop" onClick={() => setDrawerOpen(false)} />
          <FilterSidebar compact filters={filters} onChange={updateFilters} onClear={clearAll} resultCount={sorted.length} onClose={() => setDrawerOpen(false)} />
        </div>
      ) : null}
    </>
  );
}

function CategoryNav({ active, onSelect }: { active: CategorySelection; onSelect: (category: CategorySelection) => void }) {
  return (
    <section className="shop-categories" aria-label="Shop categories">
      <div className="shop-categories__scroll">
        {categoryCards.map((category) => {
          const count = category.id === "all"
            ? products.length
            : category.id === "sale"
              ? products.filter((item) => item.isSale).length
              : products.filter((item) => item.category === category.id).length;
          return (
            <button type="button" onClick={() => onSelect(category.id)} className={active === category.id ? "is-active" : ""} aria-pressed={active === category.id} key={category.id}>
              <span className="shop-categories__image"><Image src={category.image} alt="" fill sizes="(max-width: 767px) 170px, 14vw" /></span>
              <span><strong>{category.label}</strong><small>{count} products</small></span>
              <Arrow />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return <section className="shop-empty"><p className="eyebrow">No results</p><h2>No products match your filters.</h2><button type="button" onClick={onClear}>Clear filters <Arrow /></button></section>;
}

function Arrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>;
}
