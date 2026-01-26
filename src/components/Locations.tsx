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
import { MapPin, Navigation, Clock, Anchor, Waves, Compass, Route, Sparkles, CheckCircle2 } from "lucide-react";
import islandDay from "@/assets/Island-day.jpeg";
import zanzibarImage from "@/assets/Zanzibar.jpeg";

const Locations = () => {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const locations = [
    {
      title: "Island Day",
      baseLocation: "Slipway Hotel Marina",
      description: "Our main operations base in Tanzania's commercial capital, offering easy access to pristine marine reserves and islands.",
      routes: [
        { 
          name: "Hotel Slipway", 
          type: "Departure Point",
          description: "Your journey begins here at the Slipway Hotel Marina, one of Dar es Salaam's premier waterfront locations.",
          duration: "0 min",
          distance: "0 km",
          activities: ["Boarding", "Safety briefing", "Welcome drinks"],
          highlight: "Starting point with modern facilities"
        },
        { 
          name: "Bongoyo Island", 
          type: "Marine Reserve",
          description: "A pristine marine reserve with crystal-clear waters perfect for snorkeling and swimming. The island features beautiful beaches and excellent coral reefs.",
          duration: "30 min",
          distance: "8 km",
          activities: ["Snorkeling", "Swimming", "Beach relaxation", "Marine life viewing"],
          highlight: "Best snorkeling spot in Dar"
        },
        { 
          name: "Mbudya Island", 
          type: "Nature Reserve",
          description: "An untouched nature reserve offering pristine beaches, nature trails, and excellent opportunities for bird watching and beach activities.",
          duration: "45 min",
          distance: "12 km",
          activities: ["Nature walks", "Beach activities", "Bird watching", "Picnic spots"],
          highlight: "Pristine natural environment"
        },
        { 
          name: "Sinda Island", 
          type: "Private Beach",
          description: "A secluded private beach destination perfect for relaxation, sunbathing, and enjoying exclusive beach access away from crowds.",
          duration: "60 min",
          distance: "15 km",
          activities: ["Private beach access", "Sunbathing", "Swimming", "Beach dining"],
          highlight: "Exclusive private beach experience"
        }
      ],
      image: islandDay,
      totalDuration: "4-6 hours",
      bestFor: "Half Day & Full Day Charters"
    },
    {
      title: "Zanzibar",
      baseLocation: "Hotel Verde & Nungwi",
      description: "Experience the spice island's magic with our Zanzibar operations, featuring historic Stone Town and pristine northern beaches.",
      routes: [
        { 
          name: "Hotel Verde", 
          type: "Departure Point",
          description: "Begin your Zanzibar adventure from Hotel Verde, located in the heart of Stone Town with easy access to the historic waterfront.",
          duration: "0 min",
          distance: "0 km",
          activities: ["Boarding", "Route briefing", "Welcome refreshments"],
          highlight: "Historic Stone Town departure"
        },
        { 
          name: "Stone Town", 
          type: "Historic Site",
          description: "Cruise along the historic Stone Town waterfront, a UNESCO World Heritage Site, featuring stunning architecture and rich cultural heritage.",
          duration: "15 min",
          distance: "3 km",
          activities: ["Historic sightseeing", "Photography", "Cultural experience"],
          highlight: "UNESCO World Heritage views"
        },
        { 
          name: "Prison Island", 
          type: "Wildlife Sanctuary",
          description: "Visit the famous Prison Island, home to giant Aldabra tortoises and historic ruins. Perfect for wildlife encounters and history enthusiasts.",
          duration: "30 min",
          distance: "6 km",
          activities: ["Tortoise encounters", "Historical exploration", "Snorkeling", "Island tour"],
          highlight: "Giant tortoise sanctuary"
        },
        { 
          name: "Nakupenda Island", 
          type: "Sandbank Paradise",
          description: "Experience the magical Nakupenda sandbank that appears during low tide - a stunning natural phenomenon perfect for unique photos and swimming.",
          duration: "45 min",
          distance: "10 km",
          activities: ["Sandbank exploration", "Swimming", "Photography", "Beach activities"],
          highlight: "Famous disappearing sandbank"
        },
        { 
          name: "Kendwa Rocks", 
          type: "Sunset Cruise",
          description: "End your day at Kendwa Rocks, famous for spectacular sunsets, clear turquoise waters, and stunning rock formations. Perfect for sunset viewing.",
          duration: "60 min",
          distance: "25 km",
          activities: ["Sunset viewing", "Swimming", "Rock exploration", "Evening relaxation"],
          highlight: "Best sunset spot in Zanzibar"
        }
      ],
      image: zanzibarImage,
      totalDuration: "6-8 hours",
      bestFor: "Full Day & Extended Charters"
    }
  ];

  return (
    <section id="locations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Main Locations */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground font-quicksand" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Charter <span className="bg-gradient-ocean bg-clip-text text-transparent font-quicksand">Packages</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Operating from two stunning locations across Tanzania, we provide easy access to 
            the most beautiful islands and marine destinations in East Africa.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {locations.map((location, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 border-0 bg-card/80 backdrop-blur-sm">
              <div 
                className="h-64 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${location.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
                <div className="absolute top-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-quicksand">{location.title}</h3>
                  <p className="text-white/80 flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {location.baseLocation}
                  </p>
                </div>
              </div>
              
              <CardHeader>
                <CardDescription className="text-muted-foreground text-base">
                  {location.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Tour Routes
                </h4>
                <div className="space-y-3 mb-6">
                  {location.routes.slice(0, 3).map((route, routeIndex) => (
                    <div key={routeIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium text-foreground">{route.name}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {route.type}
                      </span>
                    </div>
                  ))}
                  {location.routes.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground">
                      +{location.routes.length - 3} more destinations
                    </div>
                  )}
                </div>
                <Button 
                  variant="ocean" 
                  className="w-full group relative overflow-hidden"
                  onClick={() => setSelectedLocation(index)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Route className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
                    View Routes
                  </span>
                  <span className="absolute inset-0 bg-gradient-sunset opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Route Visualization Dialog */}
      {selectedLocation !== null && (
        <Dialog open={selectedLocation !== null} onOpenChange={(open) => !open && setSelectedLocation(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-100 via-blue-50 to-white backdrop-blur-md border border-blue-200/50 shadow-2xl">
            {locations[selectedLocation] && (
              <>
                <DialogHeader className="pb-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <Compass className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-quicksand">
                        {locations[selectedLocation].title} Routes
                      </DialogTitle>
                      <DialogDescription className="text-base text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {locations[selectedLocation].baseLocation}
                      </DialogDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {locations[selectedLocation].totalDuration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-md text-sm font-medium">
                      <Sparkles className="h-3.5 w-3.5" />
                      {locations[selectedLocation].bestFor}
                    </span>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Route Timeline Visualization */}
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>
                    
                    {locations[selectedLocation].routes.map((route, index) => (
                      <div key={index} className="relative pl-16 pb-8 last:pb-0">
                        {/* Route Node */}
                        <div className="absolute left-4 top-1 w-4 h-4 bg-gradient-ocean rounded-full border-4 border-background shadow-lg flex items-center justify-center">
                          {index === 0 && <Anchor className="h-2 w-2 text-white" />}
                          {index > 0 && index < locations[selectedLocation].routes.length - 1 && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                          {index === locations[selectedLocation].routes.length - 1 && (
                            <CheckCircle2 className="h-2.5 w-2.5 text-white fill-white" />
                          )}
                        </div>

                        {/* Route Card */}
                        <Card className="group hover:shadow-luxury transition-all duration-300 hover:-translate-x-1 border-0 bg-card/80 backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <CardTitle className="text-xl font-bold text-foreground">
                                    {route.name}
                                  </CardTitle>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                    {route.type}
                                  </span>
                                </div>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                  {route.description}
                                </CardDescription>
                              </div>
                              {index > 0 && (
                                <div className="text-right flex-shrink-0">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                    <Clock className="h-3 w-3" />
                                    {route.duration}
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Navigation className="h-3 w-3" />
                                    {route.distance}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="mb-3">
                              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                                Highlight
                              </span>
                              <p className="text-sm text-foreground mt-1 font-medium">
                                {route.highlight}
                              </p>
                            </div>
                            
                            <div>
                              <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 block">
                                Activities Available
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {route.activities.map((activity, actIndex) => (
                                  <span 
                                    key={actIndex}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted/50 text-muted-foreground rounded-md text-xs"
                                  >
                                    <Waves className="h-3 w-3" />
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Summary Section */}
                  <div className="bg-gradient-to-br from-primary/10 to-ocean-light/20 rounded-lg p-6 border border-primary/20">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                      <Route className="h-5 w-5 text-primary" />
                      Route Summary
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-background/50 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-ocean bg-clip-text text-transparent mb-1">
                          {locations[selectedLocation].routes.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Destinations</div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-ocean bg-clip-text text-transparent mb-1">
                          {locations[selectedLocation].totalDuration}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Duration</div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-sunset bg-clip-text text-transparent mb-1">
                          {locations[selectedLocation].routes.reduce((acc, route) => acc + route.activities.length, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Activities</div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/booking" className="flex-1" onClick={() => setSelectedLocation(null)}>
                        <Button 
                          variant="ocean" 
                          size="lg" 
                          className="w-full group relative overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <Anchor className="h-5 w-5" />
                            Book This Route
                          </span>
                          <span className="absolute inset-0 bg-gradient-sunset opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => setSelectedLocation(null)}
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
    </section>
  );
};

export default Locations;