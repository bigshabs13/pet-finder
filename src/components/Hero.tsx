import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroPet from "@/assets/hero-pet.jpg";

export const Hero = () => {
  const scrollToForm = () => {
    document.getElementById("create-profile")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[image:var(--gradient-hero)]">
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroPet} 
          alt="Happy pet with QR code collar" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
            Never Lose Your
            <span className="block text-primary mt-2">Best Friend</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-muted-foreground">
            Generate a unique QR code for your pet. When scanned, it instantly shows your contact details – 
            helping bring lost pets home safely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="text-base px-8"
            >
              Create Pet Profile
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={scrollToForm}
              className="text-base px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <button 
          onClick={scrollToForm}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-8 h-8 text-primary" />
        </button>
      </div>
    </section>
  );
};
