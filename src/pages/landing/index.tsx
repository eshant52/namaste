import { LandingFooter } from "./components/LandingFooter";
import { LandingHeader } from "./components/LandingHeader";
import { LandingHero } from "./components/LandingHero";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-6">
      <LandingHeader />
      <LandingHero />
      <LandingFooter />
    </div>
  );
}
