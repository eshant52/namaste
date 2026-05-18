import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { StatusPageLayout } from "../components/app/StatusPageLayout";

export function AppError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";
  let badge = "Unknown Error";
  let isExpanded = false;

  if (isRouteErrorResponse(error)) {
    title = error.statusText || "Oops!";
    message =
      error.data?.message ||
      "The page you are looking for does not exist or an error occurred.";
    badge = `Error ${error.status}`;
  } else if (error instanceof Error) {
    title = error.name || "Application Error";
    message = error.message;
    badge = "Client Error";
    isExpanded = true;
  }

  return (
    <StatusPageLayout
      tone="destructive"
      icon={<AlertTriangle className="size-10 text-destructive" />}
      badge={badge}
      title={title}
      description={message}
      details={
        isExpanded && error instanceof Error && error.stack ? (
          <div className="max-h-64 overflow-auto rounded-xl border border-border/50 bg-muted/50 p-4 text-left font-mono text-xs text-muted-foreground shadow-inner">
            <pre className="whitespace-pre-wrap wrap-break-word">
              {error.stack}
            </pre>
          </div>
        ) : null
      }
      actions={
        <div className="flex w-full flex-col gap-3 pt-4 sm:w-auto sm:flex-row">
          <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            <RefreshCcw data-icon="inline-start" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            <Home data-icon="inline-start" />
            Back to Home
          </Button>
        </div>
      }
    />
  );
}
