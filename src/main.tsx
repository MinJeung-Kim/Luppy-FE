import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "./pages/NotFound/NotFound.tsx";
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Messenger from './pages/Messenger/Messenger.tsx';
import Conference from './pages/Conference/Conference.tsx';
import Management from './pages/Management.tsx';
import AiWBoard from './pages/AiWBoard.tsx';
import App from "./App.tsx";
import "@/styles/global.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/messenger",
        element: <Messenger />,
      },
      {
        path: "/conference",
        element: <Conference />,
      },
      {
        path: "/ai-w-board",
        element: <AiWBoard />,
      },
      {
        path: "/management",
        element: <Management />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);
