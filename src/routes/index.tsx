import App from "@/App";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import LandingPage from "@/pages/landing";
import {
  loginLoader,
  registerLoader,
  appLoader,
  sessionLimitLoader,
  authLoader,
} from "./loader";
import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import SessionLimit from "@/pages/auth/SessionLimit";
import { withSuspense } from "@/components/utils/withSuspense";
import { LoadingScreenFallback } from "@/components/custom/loaders/LoadingScreenFallback";
import ChatPage from "@/pages/app/chat";
import ContactsPage from "@/pages/app/contact";
import NotificationsPage from "@/pages/app/Notifications";
import NotFound from "@/pages/NotFound";
import { AppError } from "@/pages/AppError";
import { EmptyChatState } from "@/pages/app/chat/EmptyChatState";
import { MessagePanel } from "@/pages/app/chat/messagePanel";

const authLayoutLazy = lazy(() => import("@/components/layout/AuthLayout"));
const appLayoutLazy = lazy(() => import("@/components/layout/AppLayout"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "auth",
        element: withSuspense(authLayoutLazy),
        loader: authLoader,
        HydrateFallback: () => (
          <LoadingScreenFallback caption="Loading your authentication page ..." />
        ),
        children: [
          {
            index: true,
            element: <Navigate to="login" replace />,
          },
          {
            path: "login",
            element: <Login />,
            loader: loginLoader,
          },
          {
            path: "register",
            element: <Register />,
            loader: registerLoader,
          },
          {
            path: "session-limit",
            element: <SessionLimit />,
            loader: sessionLimitLoader,
          },
        ],
      },
      {
        path: "app",
        element: withSuspense(appLayoutLazy),
        loader: appLoader,
        hydrateFallbackElement: (
          <LoadingScreenFallback caption="Loading your app ..." />
        ),
        children: [
          {
            index: true,
            element: <Navigate to="chats" replace />,
          },
          {
            path: "chats",
            element: <ChatPage />,
            children: [
              {
                index: true,
                element: <EmptyChatState />,
              },
              {
                path: ":chatId",
                element: <MessagePanel />,
              },
            ],
          },
          {
            path: "contacts",
            element: <ContactsPage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
        ],
      },
    ],
    errorElement: <AppError />,
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <AppError />,
  },
]);

export default router;
