# VANTA — Modern Streetwear E-Commerce

A premium, responsive streetwear e-commerce experience built with **Next.js 16**, **React 19**, and **TypeScript**.

**Live Demo:** https://vanta-ecommerce.vercel.app/  
**Repository:** https://github.com/bi7hz/vanta-ecommerce

---

## Overview

VANTA is a modern fashion storefront focused on a clean editorial aesthetic, responsive shopping experience, and reusable product architecture.

The project currently includes a polished homepage, catalog filtering, dynamic product pages, shopping cart functionality, product variants, and persistent client-side state.

---

## Features

- Responsive homepage and storefront
- Dynamic product catalog
- Category filtering
- Sale filtering
- Product detail pages using dynamic routes
- Multiple product images and lifestyle views
- Product size selection
- Product color / variant support
- Quantity controls
- Add to Bag functionality
- Shopping cart with subtotal calculation
- Persistent cart state with `localStorage`
- Responsive navigation
- Mobile-friendly layouts
- Vercel deployment
- Production build configured with Webpack

---

## Tech Stack

- **Next.js 16**
- **React 19**
- **TypeScript**
- **TSX / JSX**
- **CSS**
- **Node.js**
- **npm**
- **LocalStorage**
- **Git & GitHub**
- **Vercel**

---

## Project Structure

```text
vanta-ecommerce/
├── app/
│   ├── cart/
│   ├── contact/
│   ├── product/
│   │   └── [slug]/
│   ├── shop/
│   └── page.tsx
├── components/
│   ├── product/
│   ├── shop/
│   └── wishlist/
├── lib/
├── public/
│   ├── campaign/
│   └── products/
│       ├── hoodies/
│       ├── pants/
│       ├── sneakers/
│       └── tshirts/
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## Product Categories

The current catalog includes:

- Sneakers
- T-Shirts
- Hoodies
- Pants
- Sale items

Product data is structured so the homepage, shop, product pages, and cart can consume the same source of truth.

---

## Product Image Convention

Most products follow this image naming convention:

```text
01-product-front
02-product-back
03-lifestyle-front
04-lifestyle-back
```

Some products intentionally use different image sets for color variants or legacy assets.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bi7hz/vanta-ecommerce.git
```

### 2. Enter the project

```bash
cd vanta-ecommerce
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is already in use, Next.js may automatically use another available port.

---

## Production Build

The project is currently configured to build with Webpack:

```bash
npm run build
```

The `package.json` build script uses:

```text
next build --webpack
```

This configuration is also used by Vercel during deployment.

---

## Current Routes

```text
/
/shop
/cart
/contact
/product/[slug]
```

---

## Deployment

The project is deployed on **Vercel** and connected directly to the GitHub repository.

Every push to the `main` branch can trigger a new Vercel deployment.

**Production:**  
https://vanta-ecommerce.vercel.app/

---

## Roadmap

Planned improvements include:

- Fully synchronized wishlist page
- Checkout UI
- Guest checkout flow
- Login / Register / Account pages
- Authentication
- Backend API
- PostgreSQL database
- Persistent user wishlists
- Order history
- Saved addresses
- Real payment gateway integration
- Inventory management
- Admin dashboard

---

## Development Workflow

For future updates:

```bash
git add .
git commit -m "feat: describe your update"
git push
```

Vercel will then build and deploy the latest version automatically.

---

## Author

**VANTA E-Commerce**  
Designed and developed as a modern full-stack e-commerce portfolio project.

---

## Status

**Active Development**

The current deployed version is suitable for portfolio/demo use while backend, authentication, and real payment processing are planned for future iterations.
