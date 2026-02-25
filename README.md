
  # Operations Help Desk

  This is a code bundle for Operations Help Desk. The original project is available at https://www.figma.com/design/EMXw8ntWDdx94IyGOuYrsW/Operations-Help-Desk.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Vue.js (Facilio-friendly) version

This repository now also includes a Vue 3 port of the same Knowledge Base UI under:

- `src/vue/**` (Vue components/pages)
- `src/main-vue.ts` (Vue entrypoint)
- `index-vue.html` (Vue HTML entry)
- `vite.vue.config.ts` (Vue Vite config)

### Run the Vue version

1. Install dependencies:
   - `npm i`
2. Start Vue dev server:
   - `npm run dev:vue`
3. Open:
   - `http://localhost:5173/index-vue.html`

### Build the Vue version

- `npm run build:vue`

The output is generated into `dist-vue/`.

For migration details and Facilio embedding pattern, see:

- `docs/vue-facilio-migration.md`

## Facilio uploadable package (`/app`)

For direct Facilio Connected Apps upload (without Vite build), use the `/app` folder:

- `app/index.html`
- `app/scripts/HelpGuidesScripts.js`
- `app/scripts/app.js`
- `app/styles/app.css`
- `app/images/*`

This package follows the Facilio template format you shared (Vue 2 + Facilio SDK + static assets).
  