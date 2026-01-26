import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Anchor, Heart, Award, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import crewImage from "@/assets/crew.jpg";

const Team = () => {
  const teamValues = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safety First",
      description: "Our certified crew prioritizes your safety with comprehensive training, modern safety equipment, and strict maritime protocols.",
      features: ["Licensed captains", "First aid certified", "Modern safety gear", "Regular safety drills"]
    },
    {
      icon: <Anchor className="h-8 w-8" />,
      title: "Expert Navigation",
      description: "Our experienced captains know every reef, current, and secret spot along the Tanzanian coast, ensuring optimal routes and experiences.",
      features: ["Local expertise", "GPS navigation", "Weather monitoring", "Route optimization"]
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Personalized Service",
      description: "We believe every charter should be unique. Our team works closely with you to create personalized experiences that exceed expectations.",
      features: ["Custom itineraries", "Dietary accommodations", "Special occasions", "Flexible scheduling"]
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence Standards",
      description: "Our commitment to excellence drives everything we do, from yacht maintenance to customer service, ensuring every detail is perfect.",
      features: ["Quality assurance", "Regular maintenance", "Continuous training", "Customer feedback"]
    }
  ];

  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-quicksand" style={{ fontSize: 'clamp(2rem, 7vw, 71px)' }}>
            Our <span className="bg-gradient-ocean bg-clip-text text-transparent font-quicksand">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Meet the passionate professionals who make your yacht charter experience exceptional. 
            Our crew combines years of maritime expertise with genuine hospitality.
          </p>
        </div>

        {/* Team Image Section */}
        <div className="mb-16">
          <Card className="overflow-hidden border-0 bg-card/80 backdrop-blur-sm shadow-luxury">
            <div 
              className="h-96 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${crewImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Professional Crew, Exceptional Service
                  </h3>
                  <p className="text-xl text-white/90 max-w-2xl">
                    Our experienced team of captains, crew members, and hospitality professionals 
                    work together to ensure your safety, comfort, and enjoyment throughout your charter.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {teamValues.map((value, index) => (
            <Card key={index} className="group hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {value.title}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {value.features.map((feature, featureIndex) => (
                    <Badge key={featureIndex} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-card rounded-2xl p-8 shadow-card">
          <h3 className="text-3xl font-bold mb-4 text-foreground">
            Ready to Experience the Best Service?
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team is standing by to help you plan the perfect yacht charter experience. 
            Contact us today to discuss your requirements and let us create something special for you.
          </p>
          <div className="flex justify-center">
            <Link to="/booking" className="inline-block group relative">
              <span className="absolute -inset-1 rounded-full bg-gradient-ocean blur opacity-40 group-hover:opacity-60 transition duration-300"></span>
              <button className="relative inline-flex items-center gap-2 px-12 py-4 rounded-full bg-gradient-ocean text-white font-semibold tracking-wide shadow-luxury hover:-translate-y-1 transition-all duration-300">
                <CalendarClock className="h-5 w-5" />
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;