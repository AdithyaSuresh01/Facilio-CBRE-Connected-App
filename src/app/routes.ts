import { createBrowserRouter } from "react-router";
import LandingPage from "./components/LandingPage";
import CategoryDetail from "./components/CategoryDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/category/:slug",
    Component: CategoryDetail,
  },
]);
