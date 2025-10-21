import { QrCode, Shield, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Heart,
      title: "Create Profile",
      description: "Add your pet's info and your contact details in seconds"
    },
    {
      icon: QrCode,
      title: "Get QR Code",
      description: "Download and attach the unique QR code to your pet's collar"
    },
    {
      icon: Shield,
      title: "Stay Protected",
      description: "Anyone who finds your pet can scan and contact you instantly"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to keep your pet safe
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="p-8 text-center hover:shadow-[var(--shadow-soft)] transition-all duration-300 hover:scale-105 border-2"
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
