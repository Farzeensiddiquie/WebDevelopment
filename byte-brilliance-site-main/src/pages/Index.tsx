
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="lg:ml-80">
        <Hero />
      </main>
    </div>
  );
};

export default Index;
