import { createApp, type App as VueApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "../styles/index.css";

let app: VueApp<Element> | null = null;
let hostElement: Element | null = null;

export async function mountOperationsHelpDesk(
  target: string | Element,
  initialPath = "/"
) {
  if (app) {
    return;
  }

  hostElement = typeof target === "string" ? document.querySelector(target) : target;
  if (!hostElement) {
    throw new Error("Unable to mount Operations Help Desk: target element not found.");
  }

  await router.push(initialPath);
  app = createApp(App);
  app.use(router);
  app.mount(hostElement);
}

export function unmountOperationsHelpDesk() {
  if (!app || !hostElement) {
    return;
  }

  app.unmount();
  app = null;
  hostElement = null;
}
