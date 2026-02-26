# React TSX (Figma Make) to Vue + Facilio: practical migration steps

This repo includes a working Vue 3 migration of the same Operations Help Desk UI.

## 1) Keep design parity first

For generated Figma Make code, the fastest way to preserve exact UI is:

1. Keep the same class names (Tailwind utilities)
2. Keep spacing/typography tokens unchanged
3. Convert JSX event/model syntax into Vue directives

### JSX -> Vue mapping used in this migration

- `className="..."` -> `class="..."`
- `{value}` -> `{{ value }}`
- `onClick={fn}` -> `@click="fn"`
- `onChange={(e) => setState(e.target.value)}` -> `v-model` (or `@input`)
- `{condition && <Block />}` -> `v-if="condition"`
- `{items.map(...)}` -> `v-for="item in items" :key="item.id"`

## 2) Routing conversion

React Router:

- `createBrowserRouter([...])`
- `useNavigate()`
- `useParams()`

Vue Router equivalent:

- `createRouter({ history: createWebHistory(), routes: [...] })`
- `useRouter()` + `router.push(...)`
- `useRoute()` + `route.params.slug`

Files in this repo:

- `src/vue/router.ts`
- `src/vue/pages/LandingPage.vue`
- `src/vue/pages/CategoryDetail.vue`

## 3) State conversion

React `useState`/derived values were mapped to:

- `ref(...)` for mutable state
- `computed(...)` for derived filters/counts

This is implemented in:

- `src/vue/pages/LandingPage.vue`
- `src/vue/pages/CategoryDetail.vue`

## 4) Icons and libraries

- `lucide-react` -> `lucide-vue-next`
- React plugin config -> Vue plugin config (`vite.vue.config.ts`)

## 5) Facilio compatibility pattern

Use mount/unmount exports so Facilio (or any host shell) can control lifecycle:

- `src/vue/facilio-mount.ts`

It provides:

- `mountOperationsHelpDesk(target, initialPath?)`
- `unmountOperationsHelpDesk()`

This pattern avoids hard-wiring startup to a single page load and is easier to embed in host platforms.

## 6) Run commands

```bash
npm i
npm run dev:vue
# open http://localhost:5173/index-vue.html
```

Build:

```bash
npm run build:vue
```

## 7) Notes for "exact same" visuals

The original React export used `figma:asset/...` image imports. Those are Figma-Make-specific and not directly portable to plain Vue/Vite.

In this migration:

- Layout, spacing, typography, interactions, filters, and modal behavior were preserved.
- Brand/illustration visuals were replaced with local UI-safe equivalents so the Vue app works without Figma asset resolvers.
