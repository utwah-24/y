import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import heroVideo from "@/assets/videos/IMG_0195.MOV";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/35"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-quicksand" style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)' }}>
          Luxury Yacht
          <span className="block bg-gradient-ocean bg-clip-text text-transparent font-quicksand">
            Adventures
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
          Experience the pristine waters of Tanzania aboard our premium yacht fleet. 
          Discover hidden islands, pristine beaches, and unforgettable moments in 
          Dar es Salaam and Zanzibar.
        </p>

        {/* Location Badges */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Dar es Salaam • Slipway Hotel</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Zanzibar • Hotel Verde & Nungwi</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;