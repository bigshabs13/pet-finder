import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import pet1 from "@/assets/1.jpg";
import pet2 from "@/assets/2.webp";
import pet3 from "@/assets/3.webp";
import pet4 from "@/assets/4.avif";
import pet5 from "@/assets/5.avif";

const petImages = [pet1, pet2, pet3, pet4, pet5];

export const Hero = () => {
  const [currentPet, setCurrentPet] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPet((prev) => (prev + 1) % petImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToForm = () => {
    document.getElementById("create-profile")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-900 via-green-800 to-green-900">
      <div className="absolute inset-0 opacity-60">
        <img 
          src={petImages[currentPet]} 
          alt="Happy pet" 
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
            <Link to="/learn-more">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-base px-8"
              >
                Learn More
              </Button>
            </Link>
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
