import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: string;
}

export const LoadingScreenFallback = ({
  className,
  caption,
  ...props
}: LoadingScreenFallbackProps) => (
  <div
    className={cn(
      "flex h-screen flex-col items-center justify-center",
      className,
    )}
    {...props}
  >
    <Loader2 className="size-10 animate-spin text-blue-500 dark:text-neutral-200" />
    <p className="mt-4 text-blue-500 dark:text-neutral-200">
      {caption || "Loading page ..."}
    </p>
  </div>
);
