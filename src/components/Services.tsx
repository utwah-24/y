import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Calendar, MapPin, Users, Check, Sparkles, Waves, Anchor, Star } from "lucide-react";
import sunsetCruise from "@/assets/sunset-cruise.jpg";

const Services = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const services = [
    {
      title: "Half Day Charter",
      duration: "4-6 Hours",
      description: "Perfect for a morning or afternoon adventure. Explore nearby islands, snorkel in crystal clear waters, and enjoy a delicious lunch on board.",
      features: ["Snorkeling gear included", "Fresh seafood lunch", "Professional crew", "Island hopping"],
      icon: <Clock className="h-8 w-8" />,
      image: sunsetCruise,
      detailedDescription: "Perfect for those seeking a quick escape to paradise. Our Half Day Charter offers an immersive experience in the pristine waters of Tanzania. Whether you choose a morning departure to catch the sunrise or an afternoon cruise to witness the golden hour, you'll explore stunning coral reefs, visit secluded beaches, and enjoy world-class hospitality.",
      additionalFeatures: [
        "Professional snorkeling equipment",
        "Freshly prepared seafood lunch",
        "Experienced captain and crew",
        "Visit 2-3 nearby islands",
        "Complimentary soft drinks",
        "Safety equipment and life jackets",
        "Beach access and swimming stops"
      ],
      pricing: {
        dar: {
          "20 Max Catamaran": "$1,100",
          "25 Max Catamaran": "$1,500"
        },
        zanzibar: {
          "20 Max Catamaran": "$1,400",
          "25 Max Catamaran": "$1,800"
        }
      },
      highlights: ["Best for first-time visitors", "Perfect for families", "Great value for money"]
    },
    {
      title: "Full Day Charter",
      duration: "8-10 Hours",
      description: "The ultimate yacht experience. Visit multiple islands, enjoy extended swimming and snorkeling time, and witness spectacular sunsets.",
      features: ["Multiple island visits", "Full meal service", "Sunset viewing", "Water sports equipment"],
      icon: <Calendar className="h-8 w-8" />,
      image: sunsetCruise,
      detailedDescription: "Experience the complete yacht charter adventure with our Full Day Charter. This comprehensive package takes you on an unforgettable journey through Tanzania's most beautiful waters. From sunrise to sunset, you'll discover hidden coves, vibrant marine life, and pristine beaches while enjoying exceptional service and cuisine.",
      additionalFeatures: [
        "Visit 4-5 different locations",
        "Full breakfast and lunch service",
        "Premium snorkeling equipment",
        "Water sports equipment (kayaks, paddle boards)",
        "Sunset viewing experience",
        "Professional photography opportunities",
        "Extended swimming and relaxation time",
        "Complimentary beverages throughout the day"
      ],
      pricing: {
        dar: {
          "20 Max Catamaran": "$1,500",
          "25 Max Catamaran": "$2,000"
        },
        zanzibar: {
          "20 Max Catamaran": "$1,800",
          "25 Max Catamaran": "$2,400"
        }
      },
      highlights: ["Most popular choice", "Complete day experience", "Perfect for special occasions"]
    },
    {
      title: "Week Charter",
      duration: "7 Days",
      description: "The most comprehensive yacht adventure. Explore the entire coast of Tanzania, visit remote islands, and create memories that last a lifetime.",
      features: ["Cabin accommodation", "All meals included", "Professional captain", "Custom itinerary"],
      icon: <MapPin className="h-8 w-8" />,
      image: sunsetCruise,
      detailedDescription: "Embark on the ultimate luxury yacht adventure with our Week Charter. This exclusive experience allows you to explore the entire Tanzanian coastline at your own pace. From Dar es Salaam to Zanzibar and beyond, discover remote islands, untouched beaches, and vibrant local culture while enjoying the comfort and luxury of your private yacht.",
      additionalFeatures: [
        "Private cabin accommodation",
        "All meals and premium beverages included",
        "Professional captain and full crew",
        "Completely customizable itinerary",
        "Access to remote and exclusive locations",
        "Daily activities and excursions",
        "Fishing equipment and water sports",
        "Onboard entertainment and relaxation areas",
        "24/7 concierge service",
        "Airport transfers included"
      ],
      pricing: {
        dar: {
          "20 Max Catamaran": "$2,000/day",
          "25 Max Catamaran": "$2,600/day"
        },
        zanzibar: {
          "20 Max Catamaran": "$2,200/day",
          "25 Max Catamaran": "$2,800/day"
        }
      },
      highlights: ["Ultimate luxury experience", "Complete privacy", "Fully customizable"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-spartan" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Charter <span className="bg-gradient-ocean bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose from our carefully crafted charter packages, each designed to provide you with 
            an unforgettable yacht experience in the pristine waters of Tanzania.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
              <div 
                className="h-48 bg-cover bg-center rounded-t-lg relative overflow-hidden"
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-hero group-hover:bg-gradient-ocean transition-all duration-300"></div>
                <div className="absolute top-4 left-4 text-white">
                  {service.icon}
                </div>
                <div className="absolute bottom-4 right-4 text-white">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {service.duration}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="ocean" 
                  className="w-full group/btn relative overflow-hidden"
                  onClick={() => setSelectedService(index)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                    Learn More
                  </span>
                  <span className="absolute inset-0 bg-gradient-sunset opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Details Dialog */}
        {selectedService !== null && (
          <Dialog open={selectedService !== null} onOpenChange={(open) => !open && setSelectedService(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-md border-0 shadow-2xl">
              {services[selectedService] && (
                <>
                  <DialogHeader className="relative">
                    <div 
                      className="absolute inset-0 -z-10 bg-cover bg-center rounded-t-lg opacity-20"
                      style={{ backgroundImage: `url(${services[selectedService].image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-ocean"></div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center text-white shadow-luxury">
                        {services[selectedService].icon}
                      </div>
                      <div>
                        <DialogTitle className="text-3xl font-bold text-foreground">
                          {services[selectedService].title}
                        </DialogTitle>
                        <DialogDescription className="text-lg text-muted-foreground mt-1">
                          {services[selectedService].duration} of Luxury
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2">
                      {services[selectedService].highlights.map((highlight, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-ocean/10 text-primary rounded-full text-sm font-medium"
                        >
                          <Star className="h-3 w-3 fill-primary" />
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Detailed Description */}
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <Waves className="h-5 w-5 text-primary" />
                        About This Charter
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {services[selectedService].detailedDescription}
                      </p>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-gradient-to-br from-primary/10 to-ocean-light/20 rounded-lg p-6 border border-primary/20">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <Anchor className="h-5 w-5 text-primary" />
                        Pricing Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Dar es Salaam</h4>
                          <div className="space-y-2">
                            {Object.entries(services[selectedService].pricing.dar).map(([yacht, price]) => (
                              <div key={yacht} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">{yacht}</span>
                                <span className="text-lg font-bold bg-gradient-ocean bg-clip-text text-transparent">
                                  {price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Zanzibar</h4>
                          <div className="space-y-2">
                            {Object.entries(services[selectedService].pricing.zanzibar).map(([yacht, price]) => (
                              <div key={yacht} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">{yacht}</span>
                                <span className="text-lg font-bold bg-gradient-sunset bg-clip-text text-transparent">
                                  {price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What's Included */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <Check className="h-5 w-5 text-primary" />
                        What's Included
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {services[selectedService].additionalFeatures.map((feature, idx) => (
                          <div 
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/booking" className="flex-1" onClick={() => setSelectedService(null)}>
                          <Button 
                            variant="ocean" 
                            size="lg" 
                            className="w-full group relative overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              Book This Charter
                            </span>
                            <span className="absolute inset-0 bg-gradient-sunset opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => setSelectedService(null)}
                          className="flex-1"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Meal Service Section */}
        <div className="bg-card rounded-2xl p-8 shadow-card">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Premium <span className="bg-gradient-sunset bg-clip-text text-transparent">Dining</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our expert chefs prepare fresh, local seafood and international cuisine to complement your yacht experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Fresh Seafood", description: "Locally caught fish, prawns, and lobster" },
              { title: "Tropical Fruits", description: "Seasonal fruits from Tanzanian farms" },
              { title: "International Cuisine", description: "Continental and fusion dishes" },
              { title: "Refreshing Drinks", description: "Fresh juices, sodas, and water" }
            ].map((meal, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">{meal.title}</h4>
                <p className="text-sm text-muted-foreground">{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;