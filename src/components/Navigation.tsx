import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@/assets/small-logo.jpeg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#locations", label: "Locations" },
    { href: "#team", label: "Our Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img 
            src={logoImage} 
            alt="Yacht Dealers Tanzania" 
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-bold text-primary font-quicksand">Yachtdealers.tz</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors duration-300 font-quicksand font-black"
            >
              {item.label}
            </a>
          ))}
          <Link to="/booking">
            <Button variant="ocean" size="sm" className="font-quicksand">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-foreground hover:text-primary transition-colors duration-300 font-quicksand font-black"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link to="/booking" className="w-full">
              <Button variant="ocean" className="w-full font-quicksand" onClick={() => setIsOpen(false)}>
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;