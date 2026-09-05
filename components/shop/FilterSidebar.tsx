"use client";

import { brands, categoryLabels, colors, shopCategories } from "@/lib/products";
import type { FilterState } from "./types";

type Props = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
  resultCount: number;
  compact?: boolean;
  onClose?: () => void;
};

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
const categoryOptions = ["all", ...shopCategories, "sale"] as const;

export function FilterSidebar({ filters, onChange, onClear, resultCount, compact = false, onClose }: Props) {
  const sizes = filters.category === "sneakers"
    ? shoeSizes
    : filters.category === "all" || filters.category === "sale"
        ? [...clothingSizes, ...shoeSizes]
        : clothingSizes;

  const updateArray = (key: "brands" | "sizes" | "colors", value: string) => {
    onChange({ ...filters, [key]: filters[key].includes(value) ? filters[key].filter((item) => item !== value) : [...filters[key], value] });
  };
  const setCategory = (category: FilterState["category"]) => onChange({ ...filters, category, saleOnly: category === "sale" });

  return (
    <aside className={`filter-sidebar ${compact ? "filter-sidebar--drawer" : ""}`} aria-label="Product filters">
      <div className="filter-sidebar__top">
        <div><p className="eyebrow">Filters</p><strong>{resultCount} products</strong></div>
        <button type="button" onClick={onClear}>Clear all</button>
        {onClose ? <button className="filter-close" type="button" onClick={onClose} aria-label="Close filters">&#215;</button> : null}
      </div>
      <FilterGroup title="Category">
        <div className="filter-options">
          {categoryOptions.map((category) => (
            <label key={category}>
              <input type="radio" name={compact ? "drawer-category" : "category"} checked={filters.category === category} onChange={() => setCategory(category as FilterState["category"])} />
              <span>{category === "all" ? "All" : category === "sale" ? "Sale" : categoryLabels[category]}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Brand">
        <div className="filter-options">
          {brands.map((brand) => (
            <label key={brand}><input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => updateArray("brands", brand)} /><span>{brand}</span></label>
          ))}
        </div>
      </FilterGroup>
      {sizes.length ? <FilterGroup title="Size"><div className="size-options">{sizes.map((size) => <button className={filters.sizes.includes(size) ? "is-active" : ""} type="button" onClick={() => updateArray("sizes", size)} key={size}>{size.replace("US ", "")}</button>)}</div></FilterGroup> : null}
      <FilterGroup title="Color"><div className="color-options">{colors.map((color) => <button type="button" className={filters.colors.includes(color) ? "is-active" : ""} onClick={() => updateArray("colors", color)} aria-label={`Filter ${color}`} key={color}><span className={`swatch swatch--${color.toLowerCase().replace(/\s+/g, "-")}`} /></button>)}</div></FilterGroup>
      <FilterGroup title="Price"><div className="price-options"><label>Min<input type="number" min="0" max={filters.maxPrice} value={filters.minPrice} onChange={(event) => onChange({ ...filters, minPrice: Number(event.target.value) })} /></label><label>Max<input type="number" min={filters.minPrice} max="300" value={filters.maxPrice} onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })} /></label></div></FilterGroup>
      <FilterGroup title="Availability"><div className="filter-options"><label><input type="radio" name={compact ? "drawer-stock" : "stock"} checked={filters.availability === "in"} onChange={() => onChange({ ...filters, availability: "in" })} /><span>In stock</span></label><label><input type="radio" name={compact ? "drawer-stock" : "stock"} checked={filters.availability === "out"} onChange={() => onChange({ ...filters, availability: "out" })} /><span>Out of stock</span></label></div></FilterGroup>
      <label className="sale-toggle"><input type="checkbox" checked={filters.saleOnly} onChange={(event) => onChange({ ...filters, saleOnly: event.target.checked, category: filters.category === "sale" && !event.target.checked ? "all" : filters.category })} /><span>On sale only</span></label>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="filter-group"><h2>{title}<span aria-hidden="true">&#8964;</span></h2>{children}</section>;
}
