import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, UtensilsCrossed } from "lucide-react";
import Footer from "@/components/Footer";

const MenuPage = () => {
  const navigate = useNavigate();

  const menuCategories = [
    {
      title: "CHEF MENU",
      items: [
        "Beef skewers",
        "Fish skewers",
        "BBQ rosemary chicken",
        "Garlic prawns",
        "Plantains",
        "Roast potatoes",
        "Veg. Fried rice",
        "Apple salad",
        "Avocado salad",
        "Tommysalad",
        "Cubes salad",
        "Chachandu",
        "Matunda"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-4 bg-black/10 rounded-full">
                <UtensilsCrossed className="h-12 w-12 text-black" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black font-quicksand mb-6" style={{ fontSize: 'clamp(2.5rem, 8vw, 80px)' }}>
              Our Food Menu
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our exquisite selection of dishes crafted with the finest ingredients
            </p>
          </div>

          {/* Menu Content */}
          <div className="max-w-4xl mx-auto">
            {menuCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl md:text-4xl font-black text-black font-quicksand mb-8 pb-4 border-b-4 border-black">
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-black group-hover:bg-black/70 transition-colors"></div>
                        <span className="text-lg md:text-xl font-semibold text-gray-800 font-quicksand">
                          {item}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;

