import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const pricingData = [
    {
      location: "Dar Yacht Charter",
      packages: [
        {
          yacht: "20 Max Catamaran",
          options: [
            { type: "Half Day Charter", price: "$1,100" },
            { type: "Full Day Charter", price: "$1,500" },
            { type: "Live Onboard (24 Hours)", price: "$2,000" },
          ],
        },
        {
          yacht: "25 Max Catamaran",
          options: [
            { type: "Half Day Cruise", price: "$1,500" },
            { type: "Full Day Cruise", price: "$2,000" },
            { type: "Live Onboard (24 Hours)", price: "$2,600" },
          ],
        },
      ],
    },
    {
      location: "Zanzibar Charter",
      packages: [
        {
          yacht: "20 Max Catamaran",
          options: [
            { type: "Half Day Cruise", price: "$1,400" },
            { type: "Full Day Cruise", price: "$1,800" },
            { type: "Live Onboard (24 Hours)", price: "$2,200" },
          ],
        },
        {
          yacht: "25 Max Catamaran",
          options: [
            { type: "Half Day Cruise", price: "$1,800" },
            { type: "Full Day Cruise", price: "$2,400" },
            { type: "Live Onboard (24 Hours)", price: "$2,800" },
          ],
        },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-spartan" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Charter <span className="bg-gradient-ocean bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transparent pricing for unforgettable yacht experiences in Dar es Salaam and Zanzibar
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {pricingData.map((location, locationIndex) => (
            <div key={locationIndex}>
              <h3 className="text-3xl font-bold mb-8 text-center text-primary">
                {location.location}
              </h3>

              <div className="space-y-8">
                {location.packages.map((pkg, pkgIndex) => (
                  <Card
                    key={pkgIndex}
                    className="group hover:shadow-luxury transition-all duration-300 border-primary/20 bg-card/80 backdrop-blur-sm"
                  >
                    <CardHeader className="bg-gradient-ocean text-white">
                      <CardTitle className="text-2xl font-bold text-center">
                        {pkg.yacht}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {pkg.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-foreground font-medium">
                                {option.type}
                              </span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                              {option.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            All charters include professional crew, snorkeling equipment, and refreshments. 
            Contact us for custom packages and group discounts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
