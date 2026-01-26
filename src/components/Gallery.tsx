import { useNavigate } from "react-router-dom";
import foodImage from "@/assets/food.jpeg";
import { Button } from "@/components/ui/button";

const Gallery = () => {
  const navigate = useNavigate();
  
  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6 lg:space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black font-quicksand leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 70px)' }}>
              Our Food Menu
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
              Savor the finest culinary experiences on the water. Our expert chefs craft exquisite meals using the freshest local ingredients, bringing you a taste of Tanzania's rich flavors while you sail through paradise.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              From fresh seafood caught daily to traditional dishes prepared with love, every meal is an adventure. Experience dining that matches the luxury of your yacht journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => navigate('/menu')}
                className="bg-black text-white hover:bg-black/90 px-8 py-6 text-lg font-semibold rounded-lg"
              >
                View Full Menu
              </Button>
            </div>
          </div>

          {/* Right Side - Food Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                <img
                  src={foodImage}
                  alt="Delicious yacht dining experience"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Elements */}
              {/* Top Right - Rating Badge */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-10 animate-float">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">★★★★★</span>
                  <span className="text-sm font-semibold text-gray-900">Fresh Daily</span>
                </div>
              </div>
              
              {/* Bottom Left - Review Card */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg z-10 animate-float-delayed max-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-xs font-semibold text-gray-900">4.8 (256)</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">Exquisite flavors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
