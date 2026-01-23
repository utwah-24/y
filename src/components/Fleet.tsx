import { Link } from "react-router-dom";
import yachtCrew from "@/assets/yacht-crew.jpg";
import yachtViewSea from "@/assets/yacht-view-sea.jpg";
import yachtOceanView from "@/assets/yacht-ocean-view.jpg";
import yachtViewIsland from "@/assets/yacht-view-island.jpg";
import AnimatedItem from "@/components/ui/animated-item";

const Fleet = () => {
  const fleet = [
    {
      id: "misbehavior",
      name: "MISBEHAVIOR CATAMARAN",
      image: yachtCrew
    },
    {
      id: "umoja-1",
      name: "UMOJA CATAMARAN 1",
      image: yachtViewSea
    },
    {
      id: "sunday-kinga",
      name: "SUNDAY KINGA CATAMARAN",
      image: yachtOceanView
    },
    {
      id: "ocean-dream",
      name: "OCEAN DREAM",
      image: yachtViewIsland
    }
  ];

  return (
    <section id="fleet" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-black font-quicksand" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Our <span className="text-black font-quicksand">Fleet</span>
          </h2>
          <p className="text-black max-w-3xl mx-auto leading-relaxed">
            Discover our premium catamaran fleet, each vessel designed to provide you with an unforgettable yacht experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {fleet.map((yacht, index) => (
            <AnimatedItem key={index} delay={index * 100} animation="fadeInUp">
              <div className="overflow-hidden group">
                {/* Image */}
                <Link to={`/boat/${yacht.id}`}>
                  <div 
                    className="w-full aspect-square bg-cover bg-center mb-2 rounded-lg max-w-[200px] mx-auto relative overflow-hidden cursor-pointer"
                    style={{ backgroundImage: `url(${yacht.image})` }}
                  >
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
                      <button className="bg-white text-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors">
                        Read More
                      </button>
                    </div>
                  </div>
                </Link>
                
                {/* Title */}
                <h3 className="text-black text-center text-base md:text-lg font-bold font-quicksand">
                  {yacht.name}
                </h3>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fleet;


