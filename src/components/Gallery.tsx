import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Camera } from "lucide-react";
import yachtViewIsland from "@/assets/yacht-view-island.jpg";
import islandAerial from "@/assets/island-aerial.jpg";
import yachtMeal1 from "@/assets/yacht-meal-1.jpg";
import yachtMeal2 from "@/assets/yacht-meal-2.jpg";
import yachtMeal3 from "@/assets/yacht-meal-3.jpg";
import yachtMeal4 from "@/assets/yacht-meal-4.jpg";
import yachtViewSea from "@/assets/yacht-view-sea.jpg";
import islandParadise from "@/assets/island-paradise.jpg";
import yachtMeal5 from "@/assets/yacht-meal-5.jpg";
import yachtOceanView from "@/assets/yacht-ocean-view.jpg";
import yachtMeal6 from "@/assets/yacht-meal-6.jpg";

const Gallery = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const images = [
    { src: yachtViewIsland, alt: "Yacht view approaching island" },
    { src: islandAerial, alt: "Aerial view of tropical island" },
    { src: yachtMeal1, alt: "Premium yacht dining experience" },
    { src: yachtMeal2, alt: "Fresh seafood and local cuisine" },
    { src: yachtMeal3, alt: "Delicious yacht catering" },
    { src: yachtMeal4, alt: "Gourmet meals on board" },
    { src: yachtViewSea, alt: "Yacht sailing on crystal clear waters" },
    { src: islandParadise, alt: "Paradise island beach destination" },
    { src: yachtMeal5, alt: "Luxury yacht dining spread" },
    { src: yachtOceanView, alt: "Stunning ocean views from yacht" },
    { src: yachtMeal6, alt: "Traditional seafood feast on board" },
  ];

  const videos = [
    { src: "/videos/yacht-video-1.mp4", title: "Luxury Sailing Experience" },
    { src: "/videos/yacht-video-2.mp4", title: "Sunset Cruise" },
    { src: "/videos/yacht-video-3.mp4", title: "Island Hopping" },
    { src: "/videos/yacht-video-4.mp4", title: "Crystal Clear Waters" },
    { src: "/videos/yacht-video-5.mp4", title: "Onboard Dining" },
    { src: "/videos/yacht-video-6.mp4", title: "Water Activities" },
    { src: "/videos/yacht-video-7.mp4", title: "Premium Amenities" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, []);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent font-quicksand" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Experience Our Yachts
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in luxury through our stunning photo gallery and captivating video experiences
          </p>
        </div>

        {/* Photos Gallery - Masonry Style */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-primary flex items-center justify-center gap-3">
            <div className="h-1 w-12 bg-gradient-ocean"></div>
            Photo Gallery
            <div className="h-1 w-12 bg-gradient-ocean"></div>
          </h3>
          
          {/* Masonry Grid Layout */}
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 max-w-7xl mx-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-4 group cursor-pointer"
              >
                <Card className="overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/40 bg-white">
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto max-h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {/* Image Info on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white text-sm font-medium">{image.alt}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Videos Section - Horizontal Scroll */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-3">
              <Play className="h-7 w-7 text-primary" />
              Video Tours
            </h3>
            
            {/* Scroll Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                disabled={isAtStart}
                className="rounded-full border-primary/30 hover:bg-primary hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                disabled={isAtEnd}
                className="rounded-full border-primary/30 hover:bg-primary hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

            {/* Scrollable Videos */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[400px] md:w-[500px] lg:w-[600px] group"
                >
                  <Card className="overflow-hidden border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary/60 bg-gradient-to-br from-white to-secondary/20">
                    <div className="relative aspect-video bg-black">
                      <video
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        controls
                        preload="metadata"
                        poster=""
                      >
                        <source src={video.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Video Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        <h4 className="text-white font-semibold text-lg md:text-xl">
                          {video.title}
                        </h4>
                      </div>

                      {/* Play Icon Overlay (before play) */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="h-10 w-10 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {videos.map((_, index) => (
              <div
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-primary/30 transition-all duration-300"
              ></div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Gallery;
