import type { ButtonHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export function Container({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={"container " + className} {...props} />; }
export function Section({ as: Tag = "section", tone, className = "", ...props }: HTMLAttributes<HTMLElement> & { as?: ElementType; tone?: "ink" | "paper" }) { return <Tag className={"section " + (tone ? "section--" + tone : "") + " " + className} {...props} />; }
export function Heading({ as: Tag = "h2", size = "display", className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3"; size?: "hero" | "display" }) { return <Tag className={"heading heading--" + size + " " + className} {...props}>{children}</Tag>; }
export function Button({ href, children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) { const content = <>{children}</>; return href ? <Link href={href} className={"button " + className}>{content}</Link> : <button className={"button " + className} {...props}>{content}</button>; }
export function IconButton({ label, children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) { return <button className={"icon-button " + className} aria-label={label} {...props}>{children}</button>; }
export function Badge({ children }: { children: ReactNode }) { return <span className="badge">{children}</span>; }
export function SectionHeader({ eyebrow, title, description, action, actionHref = "#" }: { eyebrow: string; title: string; description?: string; action?: string; actionHref?: string }) { return <header className="section-header"><div><p className="eyebrow">{eyebrow}</p><Heading>{title}</Heading>{description ? <p>{description}</p> : null}</div>{action ? <Link className="section-header__action" href={actionHref}>{action} <span>↗</span></Link> : null}</header>; }

export type Product = { name: string; category: string; price: string; image: string; badge?: string };
export function ProductCard({ product }: { product: Product }) { return <article className="product-card"><div className="product-card__image">{product.badge ? <Badge>{product.badge}</Badge> : null}<img src={product.image} alt="" /></div><p className="product-card__category">{product.category}</p><h3>{product.name}</h3><p>{product.price}</p></article>; }
