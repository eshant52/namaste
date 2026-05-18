import { cn } from "@/lib/utils";
import Logo from "@/assets/logo.svg";

type LogoSvg = React.HTMLAttributes<HTMLImageElement>;

export default function LogoSvg({ className, ...props }: LogoSvg) {
  return (
    <img
      src={Logo}
      alt="Namaste Logo"
      className={cn("size-6 md:size-8", className)}
      {...props}
    />
  );
}
