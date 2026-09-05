import type { ShopCategory } from "@/lib/products";

export type CategorySelection = ShopCategory | "sale" | "all";
export type FilterState = { category: CategorySelection; brands: string[]; sizes: string[]; colors: string[]; minPrice: number; maxPrice: number; availability: "all" | "in" | "out"; saleOnly: boolean };
export const defaultFilters: FilterState = { category: "all", brands: [], sizes: [], colors: [], minPrice: 0, maxPrice: 300, availability: "all", saleOnly: false };
