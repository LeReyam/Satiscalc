import { AuthProvider } from "./context/AuthContext";
import { createRoot } from "react-dom/client";

import Login from "./components/login.tsx";
import Register  from "./components/register.tsx";
import Password_reset from "./components/password-reset.tsx";
import About from "./components/about.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App, {
  PlannerPage,
  RecipesPage,
  RecipeEditorPage,
  NotFoundPage,
} from "./App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <PlannerPage />,
      },
      {
        path: "recipes",
        element: <RecipesPage />,
      },
      {
        path: "recipes/new",
        element: <RecipeEditorPage />,
      },
      {
        path: "recipes/:id",
        element: <RecipeEditorPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "password-reset",
        element: <Password_reset />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);