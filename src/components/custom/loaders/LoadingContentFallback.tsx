import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingContentFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: string;
}

export default function LoadingContentFallback({
  className,
  caption,
  ...props
}: LoadingContentFallbackProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center",
        className,
      )}
      {...props}
    >
      <Loader2 className="text-foreground/50 size-6 animate-spin" />
      <p className="text-foreground/50 mt-4 text-center text-sm">
        {caption || "Loading..."}
      </p>
    </div>
  );
}
