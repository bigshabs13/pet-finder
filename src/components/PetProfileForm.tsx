import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { Download } from "lucide-react";

interface PetProfile {
  petName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
}

export const PetProfileForm = () => {
  const [profile, setProfile] = useState<PetProfile>({
    petName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: ""
  });
  const [qrData, setQrData] = useState<string>("");
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.petName || !profile.ownerName || !profile.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create a URL-friendly string with pet info
    const petData = JSON.stringify({
      pet: profile.petName,
      owner: profile.ownerName,
      phone: profile.phone,
      email: profile.email,
      address: profile.address
    });
    
    // In a real app, this would be a URL to a page that displays the pet info
    // For now, we'll encode the data directly
    const qrUrl = `${window.location.origin}/pet/${btoa(petData)}`;
    setQrData(qrUrl);
    setShowQR(true);
    
    toast.success("QR Code generated successfully!");
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${profile.petName}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR Code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <section id="create-profile" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your Pet's Profile
          </h2>
          <p className="text-lg text-muted-foreground">
            Fill in the details below to generate a unique QR code
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet's Name *</Label>
                <Input
                  id="petName"
                  value={profile.petName}
                  onChange={(e) => setProfile({ ...profile, petName: e.target.value })}
                  placeholder="e.g., Max"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Your Name *</Label>
                <Input
                  id="ownerName"
                  value={profile.ownerName}
                  onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                  placeholder="e.g., John Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="e.g., john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="e.g., 123 Main St, City"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Generate QR Code
              </Button>
            </form>
          </Card>

          <Card className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
            {showQR ? (
              <div className="space-y-6 w-full">
                <div className="flex justify-center bg-white p-6 rounded-lg">
                  <QRCode 
                    id="qr-code"
                    value={qrData} 
                    size={256}
                    level="H"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      {profile.petName}'s QR Code
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Print and attach this to your pet's collar
                    </p>
                  </div>
                  
                  <Button 
                    onClick={downloadQR}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <Download className="mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="w-24 h-24 mx-auto mb-4 opacity-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                  <QRCode value="placeholder" size={80} />
                </div>
                <p>Your QR code will appear here</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};
