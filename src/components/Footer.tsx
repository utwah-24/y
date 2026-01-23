import { Anchor, Phone, MapPin, Mail } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Charter Services", href: "#services" },
    { name: "Locations", href: "#locations" },
    { name: "Destinations", href: "#islands" },
    { name: "Our Team", href: "#team" },
  ];

  const destinations = [
    "Bongoyo Island",
    "Mbudya Island", 
    "Nakupenda Island",
    "Prison Island",
    "Mafia Island",
    "Kendwa Rocks"
  ];

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Anchor className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold font-quicksand">Yachtdealers.tz</span>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Premium yacht charter services in Tanzania. Experience luxury, comfort, and adventure on the pristine waters of Dar es Salaam and Zanzibar.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="h-4 w-4 text-white" />
                <span>0617 152 595</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="h-4 w-4 text-white" />
                <span>Dar es Salaam & Zanzibar</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white font-quicksand">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white font-quicksand">Popular Destinations</h3>
            <ul className="space-y-3">
              {destinations.map((destination, index) => (
                <li key={index} className="text-white/80">
                  {destination}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white font-quicksand">Charter Services</h3>
            <ul className="space-y-3 text-white/80">
              <li>Half Day Charter</li>
              <li>Full Day Charter</li>
              <li>Week Charter</li>
              <li>Custom Itineraries</li>
              <li>Corporate Events</li>
              <li>Private Celebrations</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © 2024 Yachtdealers.tz Tanzania. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-sm text-white/60">
                Payment via Vodacom: <span className="text-white font-medium">5998989</span>
              </div>
              <div className="flex gap-4">
                <a 
                  href="tel:0617152595" 
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Call Now
                </a>
                <a 
                  href="https://wa.me/255711942057" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-sunset hover:scale-105 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;