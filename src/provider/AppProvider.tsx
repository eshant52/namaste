import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store";
import ThemeProvider from "./ThemeProvider";
import { RouterProvider } from "react-router";
import router from "../routes/index";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/config/queryClient";

export default function AppProvider() {
  return (
    <>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="namaste-chat">
            <TooltipProvider>
              <RouterProvider router={router} />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
          <TanStackDevtools
            plugins={[
              {
                id: "tanstack-query",
                name: "Tanstack Query",
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: false,
              },
              {
                id: "tanstack-form",
                name: "Tanstack Form",
                render: <FormDevtoolsPanel />,
                defaultOpen: false,
              },
            ]}
          />
        </QueryClientProvider>
      </ReduxProvider>
    </>
  );
}
