import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 pt-16 text-center">
      <div className="max-w-200">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          V1 is now live globally
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Seamless conversations, <br />
          <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            anywhere you are.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-150 leading-relaxed text-muted-foreground md:text-xl">
          Join modern teams and communities communicating at the speed of
          thought. Experience real-time messaging designed for productivity and
          scale with end-to-end reliability.
        </p>

        <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base shadow-lg transition-all hover:shadow-primary/25"
            render={<NavLink to="/auth/register" />}
          >
            Start Chatting Today
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-primary/20 px-8 text-base"
            render={<NavLink to="/auth/login" />}
          >
            Login to Account
          </Button>
        </div>
      </div>
    </main>
  );
};
