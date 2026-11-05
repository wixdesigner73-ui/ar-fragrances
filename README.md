# AR Fragrances – redesign (front-end)

- `npm run dev` / `npm run build` / `npm run preview`
- Data: `scripts/build-data.mjs` (products from arfragrances.pk/products.json plus bottle cutouts from ../work/cut) and `scripts/build-pages.mjs`.
- The cart is stored locally. The Checkout button hands off to `https://arfragrances.pk/cart/<variantId>:<qty>?discount=CODE`, so the existing Shopify checkout, payments, shipping and accounts still do the work.
- It's a single-page app, so the host must rewrite all paths to index.html.
