import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PetProfileForm } from "@/components/PetProfileForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <PetProfileForm />
      
      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 PetFinder. Keeping pets safe, one QR code at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
