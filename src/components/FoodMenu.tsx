import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import foodImage from "@/assets/food.jpeg";

const FoodMenu = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Section - Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black font-quicksand" style={{ fontSize: 'clamp(2rem, 6vw, 60px)' }}>
              Our Food Menu
            </h2>
            
            <div className="space-y-4 text-gray-700 font-quicksand">
              <p className="text-base md:text-lg leading-relaxed">
                Savor the finest culinary experiences on the water. Our expert chefs craft exquisite meals using the freshest local ingredients, bringing you a taste of Tanzania's rich flavors while you sail through paradise.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                From fresh seafood caught daily to traditional dishes prepared with love, every meal is an adventure. Experience dining that matches the luxury of your yacht journey.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/menu">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-8 py-6 text-base font-medium font-quicksand">
                  View Full Menu
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Section - Image with Overlays */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* Circular Food Image */}
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl">
                <img 
                  src={foodImage} 
                  alt="Exquisite food selection" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rating Box 1 - Top Right: "Fresh Daily" with 5 stars */}
              <div className="absolute top-4 right-4 bg-white rounded-lg px-4 py-3 shadow-lg">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-900 font-quicksand">Fresh Daily</p>
              </div>

              {/* Rating Box 2 - Bottom Left: "4.8 (256)" with "Exquisite flavors" */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg px-4 py-3 shadow-lg">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-base font-bold text-gray-900 font-quicksand">4.8</span>
                  <span className="text-sm text-gray-600 font-quicksand">(256)</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 font-quicksand">Exquisite flavors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodMenu;
