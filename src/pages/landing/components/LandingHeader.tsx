import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import LogoSvg from "@/components/svg/Logo";

export const LandingHeader = () => {
  return (
    <header className="absolute top-0 flex h-16 w-full items-center px-4 md:px-6">
      <div className="flex items-center gap-2 font-semibold">
        <LogoSvg />
        <span className="text-xl tracking-tight">Namaste Chat</span>
      </div>
      <nav className="ml-auto flex items-center gap-4">
        <Button variant="ghost" render={<NavLink to="/auth/login" />}>
          Login
        </Button>
      </nav>
    </header>
  );
};
