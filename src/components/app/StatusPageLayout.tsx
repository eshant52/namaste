import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusTone = "default" | "destructive";

type StatusPageLayoutProps = {
  icon: ReactNode;
  badge?: string;
  title: string;
  description: string;
  details?: ReactNode;
  actions?: ReactNode;
  tone?: StatusTone;
};

export const StatusPageLayout = ({
  icon,
  badge,
  title,
  description,
  details,
  actions,
  tone = "default",
}: StatusPageLayoutProps) => {
  const isDestructive = tone === "destructive";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 text-foreground selection:bg-primary/20">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
        <div
          className={cn(
            "mb-2 flex size-20 items-center justify-center rounded-full ring-8",
            isDestructive
              ? "bg-destructive/10 ring-destructive/5"
              : "bg-primary/10 ring-primary/5",
          )}
        >
          {icon}
        </div>

        <div className="flex flex-col gap-3">
          {badge ? (
            <div
              className={cn(
                "inline-flex items-center self-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                isDestructive
                  ? "border-destructive/20 bg-destructive/10 text-destructive"
                  : "border-primary/20 bg-primary/10 text-primary",
              )}
            >
              {badge}
            </div>
          ) : null}

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        {details ? <div className="w-full">{details}</div> : null}
        {actions ? <div className="w-full">{actions}</div> : null}
      </div>
    </div>
  );
};
