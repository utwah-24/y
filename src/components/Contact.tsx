import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, CreditCard, MessageCircle, Mail, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: "0617 152 595",
      description: "Call us anytime for bookings and inquiries",
      action: "tel:0617152595"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      details: "0711 942 057",
      description: "Quick responses via WhatsApp messaging",
      action: "https://wa.me/255711942057"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Vodacom Payment",
      details: "5998989",
      description: "Secure mobile money payments",
      action: null
    }
  ];

  const locations = [
    {
      name: "Dar es Salaam",
      address: "Slipway Hotel Marina",
      area: "Msasani Peninsula",
      coordinates: "Departure point for all Dar es Salaam charters"
    },
    {
      name: "Zanzibar",
      address: "Hotel Verde",
      area: "Stone Town vicinity",
      coordinates: "Main Zanzibar operation base"
    },
    {
      name: "Nungwi",
      address: "Nungwi Beach",
      area: "Northern Zanzibar",
      coordinates: "Additional pickup location available"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-quicksand" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Get in <span className="bg-gradient-ocean bg-clip-text text-transparent font-quicksand">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to embark on your yacht charter adventure? Contact us today to start planning 
            your perfect getaway on the beautiful waters of Tanzania.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((contact, index) => (
            <Card key={index} className="group hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                  {contact.icon}
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {contact.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {contact.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-4">
                  {contact.details}
                </div>
                {contact.action && (
                  <Button variant="ocean" className="w-full" asChild>
                    <a href={contact.action} target={contact.action.startsWith('http') ? '_blank' : undefined} rel={contact.action.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      Contact Now
                    </a>
                  </Button>
                )}
                {!contact.action && (
                  <Button variant="outline" className="w-full" disabled>
                    Payment Method
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Operating Hours */}
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-luxury">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Operating Hours
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              We're available every day to help you plan your perfect yacht experience
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Daily Operations</h4>
                <p className="text-muted-foreground">7:00 AM - 8:00 PM</p>
                <p className="text-sm text-muted-foreground mt-1">Charter departures and returns</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Customer Service</h4>
                <p className="text-muted-foreground">24/7 Emergency Support</p>
                <p className="text-sm text-muted-foreground mt-1">WhatsApp available anytime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;