import { CircleSlash, Home } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { StatusPageLayout } from "../components/app/StatusPageLayout";

export default function NotFound() {
  return (
    <StatusPageLayout
      icon={<CircleSlash className="size-10 text-primary" />}
      badge="404"
      title="Page Not Found"
      description="The page you requested does not exist or may have been moved."
      actions={
        <div className="flex w-full justify-center pt-4">
          <Button render={<NavLink to="/" />}>
            <Home data-icon="inline-start" />
            Back to Home
          </Button>
        </div>
      }
    />
  );
}
