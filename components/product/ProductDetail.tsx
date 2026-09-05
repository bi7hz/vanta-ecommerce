"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ShopProduct } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";

export function ProductDetail({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [selectedImage, setSelectedImage] = useState(product.primaryImage);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const isVariantProduct = product.slug === "vanta-washed-wide-leg-pants";
  const colorImages = useMemo(() => isVariantProduct ? {
    Taupe: product.images[0],
    Gray: product.images[2],
    "Light Gray": product.images[3],
    Charcoal: product.images[4],
  } : {}, [isVariantProduct, product.images]);
  const activeImage = isVariantProduct ? colorImages[selectedColor as keyof typeof colorImages] ?? product.primaryImage : selectedImage;

  const selectColor = (color: string) => {
    setSelectedColor(color);
    if (isVariantProduct && colorImages[color as keyof typeof colorImages]) setSelectedImage(colorImages[color as keyof typeof colorImages] ?? product.primaryImage);
  };
  const addToBag = () => {
    if (!selectedSize) { setMessage("Please select a size."); return; }
    addItem({ productId: product.id, slug: product.slug, name: product.name, brand: product.brand, size: selectedSize, color: selectedColor, quantity, unitPrice: product.price, image: activeImage, maxQuantity: product.stock });
    setMessage("Added to bag");
  };

  return <section className="product-page"><div className="product-page__gallery" aria-label={`${product.name} image gallery`}>
    {product.images.map((image, index) => <button className={activeImage === image ? "is-active" : ""} type="button" onClick={() => setSelectedImage(image)} key={image} aria-label={`View ${product.name} image ${index + 1}`}><Image src={image} alt={`${product.name}, view ${index + 1}`} fill sizes="(max-width: 767px) 100vw, 31vw" style={{ objectFit: /lifestyle|detail/.test(image) ? "cover" : "contain" }} /></button>)}
  </div><aside className="product-page__info"><p className="eyebrow">{product.brand}</p><h1>{product.name}</h1><p className="product-page__price">${product.price}{product.originalPrice ? <del>${product.originalPrice}</del> : null}</p><p className="product-page__description">{product.description}</p>
    <fieldset className="product-options"><legend>Color <span>{selectedColor}</span></legend><div className="product-colors">{product.colors.map((color) => <button key={color} className={selectedColor === color ? "is-active" : ""} type="button" onClick={() => selectColor(color)}><span className={`swatch swatch--${color.toLowerCase().replace(/\s+/g, "-")}`} />{color}</button>)}</div></fieldset>
    <fieldset className="product-options"><legend>Size {selectedSize ? <span>{selectedSize}</span> : null}</legend><div className="product-sizes">{product.sizes.map((size) => <button key={size} className={selectedSize === size ? "is-active" : ""} type="button" onClick={() => { setSelectedSize(size); setMessage(""); }}>{size.replace("US ", "")}</button>)}</div></fieldset>
    <p className="product-stock">{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p><div className="product-buy"><div className="quantity-control"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}>+</button></div><button className="product-add" type="button" onClick={addToBag} disabled={!product.stock}>Add to bag</button><button className="product-wishlist" type="button" aria-label={`Add ${product.name} to wishlist`}><Heart /></button></div>{message ? <p className="product-feedback" role="status">{message}</p> : null}<div className="product-assurance"><span>Complimentary delivery over $175</span><span>30-day returns</span></div>
  </aside></section>;
}

function Heart() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.4a5.4 5.4 0 0 0 0-7.7Z" /></svg>; }
