import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  children: ReactNode;
  containerClassName?: string;
};

export const AuthPageShell = ({
  children,
  containerClassName,
}: AuthPageShellProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className={cn("w-full", containerClassName)}>{children}</div>
    </div>
  );
};
