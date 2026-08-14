import DrinkAnimation from "@/components/DrinkAnimation";
import LandingContent from "@/components/LandingContent";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] overflow-visible">
      {/* Hero — Scrollytelling Animation */}
      <DrinkAnimation />

      {/* Rest of the website */}
      <div className="relative z-10 bg-[#faf7f0]">
        <LandingContent />
      </div>
    </main>
  );
}
