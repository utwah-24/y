import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, ChevronLeft, ChevronRight, Link2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBoatById } from "@/utils/boats";
import bookingImage1 from "@/assets/booking_image1.jpeg";
import bookingImage2 from "@/assets/booking_image2.jpeg";
import bookingImage3 from "@/assets/booking_image3 .jpeg";
import yachtImage from "@/assets/yatch-image.jpg";

// Boat data - pricing and other details
const boatDatabase: Record<string, any> = {
  "misbehaviour-catamaran": {
    id: "misbehaviour-catamaran",
    name: "MISBEHAVIOUR CATAMARAN",
    year: "2020",
    model: "296 Center Console",
    condition: "New",
    length: "29' 7\"",
    beam: "10' 0\"",
    poweredBy: "Yamaha Twin F300NCA Four Stroke",
    location: "DAR ES SALAAM",
    status: "IN STOCK",
    color: "Atlantic Blue",
    monthlyPrice: "$399",
    totalPrice: "$44,000",
    description: "20 passengers max, perfect for private cruises. Experience luxury and comfort on the pristine waters of Tanzania.",
    capacity: "20 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,100" },
        { type: "Full Day Charter", price: "$1,500" },
        { type: "Live Onboard (24 Hours)", price: "$2,000" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,400" },
        { type: "Full Day Cruise", price: "$1,800" },
        { type: "Live Onboard (24 Hours)", price: "$2,200" },
      ],
    },
    destinations: [
      "Bongoyo Island",
      "Mbudya Island",
      "Sinda Island",
      "Stone Town",
      "Prison Island",
      "Nakupenda Island",
    ],
    services: [
      "Professional crew",
      "Snorkeling equipment",
      "Fresh seafood lunch",
      "Complimentary soft drinks",
      "Safety equipment",
      "Beach access",
    ],
    additionalServices: [
      "Professional DJ service",
      "Premium champagne",
      "Water sports equipment",
      "Photography service",
    ],
  },
  "sunday-kinga": {
    id: "sunday-kinga",
    name: "SUNDAY KINGA CATAMARAN",
    year: "2021",
    model: "296 Center Console",
    condition: "New",
    length: "30' 0\"",
    beam: "10' 6\"",
    poweredBy: "Yamaha Twin F300NCA Four Stroke",
    location: "ZANZIBAR",
    status: "IN STOCK",
    color: "Ocean White",
    monthlyPrice: "$450",
    totalPrice: "$48,000",
    description: "22-passengers, ideal for group celebrations. Spacious deck and premium amenities for unforgettable experiences.",
    capacity: "22 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,100" },
        { type: "Full Day Charter", price: "$1,500" },
        { type: "Live Onboard (24 Hours)", price: "$2,000" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,400" },
        { type: "Full Day Cruise", price: "$1,800" },
        { type: "Live Onboard (24 Hours)", price: "$2,200" },
      ],
    },
    destinations: [
      "Stone Town",
      "Prison Island",
      "Nakupenda Island",
      "Kendwa Rocks",
      "Bongoyo Island",
    ],
    services: [
      "Professional crew",
      "Snorkeling equipment",
      "Full meal service",
      "Sunset viewing",
      "Water sports equipment",
    ],
    additionalServices: [
      "Professional DJ service",
      "Premium champagne",
      "Kayaks and paddle boards",
    ],
  },
  "umoja": {
    id: "umoja",
    name: "UMOJA CATAMARAN",
    year: "2019",
    model: "296 Center Console",
    condition: "Used",
    length: "28' 5\"",
    beam: "9' 8\"",
    poweredBy: "Yamaha Twin F250NCA Four Stroke",
    location: "DAR ES SALAAM",
    status: "PENDING",
    color: "Navy Blue",
    monthlyPrice: "$350",
    totalPrice: "$38,000",
    description: "22-passengers, comfortable for full-day trips. Modern design with excellent facilities for your charter needs.",
    capacity: "22 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,100" },
        { type: "Full Day Charter", price: "$1,500" },
        { type: "Live Onboard (24 Hours)", price: "$2,000" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,400" },
        { type: "Full Day Cruise", price: "$1,800" },
        { type: "Live Onboard (24 Hours)", price: "$2,200" },
      ],
    },
    destinations: [
      "Bongoyo Island",
      "Mbudya Island",
      "Sinda Island",
      "Stone Town",
    ],
    services: [
      "Professional crew",
      "Snorkeling equipment",
      "Fresh seafood lunch",
      "Complimentary soft drinks",
    ],
    additionalServices: [],
  },
  // Add default data for other boats
  "albion-catamaran": {
    id: "albion-catamaran",
    name: "ALBION CATAMARAN",
    year: "2020",
    model: "296 Center Console",
    condition: "New",
    location: "DAR ES SALAAM",
    status: "IN STOCK",
    color: "White",
    description: "Premium catamaran with excellent facilities.",
    capacity: "20 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,100" },
        { type: "Full Day Charter", price: "$1,500" },
        { type: "Live Onboard (24 Hours)", price: "$2,000" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,400" },
        { type: "Full Day Cruise", price: "$1,800" },
        { type: "Live Onboard (24 Hours)", price: "$2,200" },
      ],
    },
    destinations: ["Bongoyo Island", "Mbudya Island", "Stone Town"],
    services: ["Professional crew", "Snorkeling equipment", "Fresh seafood lunch"],
    additionalServices: [],
  },
  "amani-luxury": {
    id: "amani-luxury",
    name: "AMANI LUXURY CATAMARAN",
    year: "2021",
    model: "296 Center Console",
    condition: "New",
    location: "ZANZIBAR",
    status: "IN STOCK",
    color: "White",
    description: "Luxury catamaran with premium amenities.",
    capacity: "25 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,500" },
        { type: "Full Day Charter", price: "$2,000" },
        { type: "Live Onboard (24 Hours)", price: "$2,600" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,800" },
        { type: "Full Day Cruise", price: "$2,400" },
        { type: "Live Onboard (24 Hours)", price: "$2,800" },
      ],
    },
    destinations: ["Stone Town", "Prison Island", "Nakupenda Island"],
    services: ["Professional crew", "Premium snorkeling equipment", "Full meal service"],
    additionalServices: ["Professional DJ service", "Premium champagne"],
  },
  "black-bird-heli": {
    id: "black-bird-heli",
    name: "BLACK BIRD HELI",
    year: "2020",
    model: "Helicopter",
    condition: "New",
    location: "DAR ES SALAAM",
    status: "IN STOCK",
    color: "Black",
    description: "Helicopter service for aerial tours and transfers.",
    capacity: "4 passengers",
    pricing: {
      dar: [
        { type: "30 Minute Tour", price: "$500" },
        { type: "1 Hour Tour", price: "$900" },
        { type: "Transfer Service", price: "$1,200" },
      ],
      zanzibar: [
        { type: "30 Minute Tour", price: "$600" },
        { type: "1 Hour Tour", price: "$1,000" },
        { type: "Transfer Service", price: "$1,400" },
      ],
    },
    destinations: ["Aerial Tours", "Island Transfers"],
    services: ["Professional pilot", "Safety equipment", "Scenic routes"],
    additionalServices: [],
  },
  "butterfly-catamaran": {
    id: "butterfly-catamaran",
    name: "BUTTERFLY CATAMARAN",
    year: "2021",
    model: "296 Center Console",
    condition: "New",
    location: "ZANZIBAR",
    status: "IN STOCK",
    color: "White",
    description: "Elegant catamaran perfect for special occasions.",
    capacity: "22 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,200" },
        { type: "Full Day Charter", price: "$1,600" },
        { type: "Live Onboard (24 Hours)", price: "$2,200" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,500" },
        { type: "Full Day Cruise", price: "$1,900" },
        { type: "Live Onboard (24 Hours)", price: "$2,400" },
      ],
    },
    destinations: ["Stone Town", "Prison Island", "Nakupenda Island"],
    services: ["Professional crew", "Snorkeling equipment", "Full meal service"],
    additionalServices: ["Professional DJ service"],
  },
  "helia-44-catamaran": {
    id: "helia-44-catamaran",
    name: "HELIA 44 CATAMARAN",
    year: "2020",
    model: "Helia 44",
    condition: "New",
    location: "DAR ES SALAAM",
    status: "IN STOCK",
    color: "White",
    description: "Spacious 44-foot catamaran for comfortable cruising.",
    capacity: "24 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,300" },
        { type: "Full Day Charter", price: "$1,700" },
        { type: "Live Onboard (24 Hours)", price: "$2,300" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,600" },
        { type: "Full Day Cruise", price: "$2,000" },
        { type: "Live Onboard (24 Hours)", price: "$2,500" },
      ],
    },
    destinations: ["Bongoyo Island", "Mbudya Island", "Stone Town"],
    services: ["Professional crew", "Snorkeling equipment", "Full meal service"],
    additionalServices: [],
  },
  "knlyps-catamaran": {
    id: "knlyps-catamaran",
    name: "KNLYPS CATAMARAN",
    year: "2020",
    model: "296 Center Console",
    condition: "New",
    location: "DAR ES SALAAM",
    status: "IN STOCK",
    color: "White",
    description: "Modern catamaran with excellent facilities.",
    capacity: "20 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,100" },
        { type: "Full Day Charter", price: "$1,500" },
        { type: "Live Onboard (24 Hours)", price: "$2,000" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,400" },
        { type: "Full Day Cruise", price: "$1,800" },
        { type: "Live Onboard (24 Hours)", price: "$2,200" },
      ],
    },
    destinations: ["Bongoyo Island", "Mbudya Island"],
    services: ["Professional crew", "Snorkeling equipment"],
    additionalServices: [],
  },
  "queen-of-zanzibar": {
    id: "queen-of-zanzibar",
    name: "QUEEN OF ZANZIBAR",
    year: "2021",
    model: "296 Center Console",
    condition: "New",
    location: "ZANZIBAR",
    status: "IN STOCK",
    color: "White",
    description: "Royal catamaran experience in Zanzibar waters.",
    capacity: "25 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,500" },
        { type: "Full Day Charter", price: "$2,000" },
        { type: "Live Onboard (24 Hours)", price: "$2,600" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,800" },
        { type: "Full Day Cruise", price: "$2,400" },
        { type: "Live Onboard (24 Hours)", price: "$2,800" },
      ],
    },
    destinations: ["Stone Town", "Prison Island", "Nakupenda Island"],
    services: ["Professional crew", "Premium amenities", "Full meal service"],
    additionalServices: ["Professional DJ service", "Premium champagne"],
  },
  "seamanta-catamaran": {
    id: "seamanta-catamaran",
    name: "SEAMANTA CATAMARAN",
    year: "2020",
    model: "296 Center Console",
    condition: "New",
    location: "DAR ES SALAAM",
    status: "IN STOCK",
    color: "White",
    description: "Comfortable catamaran for day trips.",
    capacity: "22 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,100" },
        { type: "Full Day Charter", price: "$1,500" },
        { type: "Live Onboard (24 Hours)", price: "$2,000" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,400" },
        { type: "Full Day Cruise", price: "$1,800" },
        { type: "Live Onboard (24 Hours)", price: "$2,200" },
      ],
    },
    destinations: ["Bongoyo Island", "Mbudya Island", "Stone Town"],
    services: ["Professional crew", "Snorkeling equipment", "Fresh seafood lunch"],
    additionalServices: [],
  },
  "vaatea-catamaran": {
    id: "vaatea-catamaran",
    name: "VAATEA CATAMARAN",
    year: "2021",
    model: "296 Center Console",
    condition: "New",
    location: "ZANZIBAR",
    status: "IN STOCK",
    color: "White",
    description: "Luxury catamaran with premium features.",
    capacity: "24 passengers",
    pricing: {
      dar: [
        { type: "Half Day Charter", price: "$1,300" },
        { type: "Full Day Charter", price: "$1,700" },
        { type: "Live Onboard (24 Hours)", price: "$2,300" },
      ],
      zanzibar: [
        { type: "Half Day Cruise", price: "$1,600" },
        { type: "Full Day Cruise", price: "$2,000" },
        { type: "Live Onboard (24 Hours)", price: "$2,500" },
      ],
    },
    destinations: ["Stone Town", "Prison Island", "Nakupenda Island"],
    services: ["Professional crew", "Premium snorkeling equipment", "Full meal service"],
    additionalServices: ["Professional DJ service"],
  },
};

const BoatDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  
  // Touch/swipe handlers for mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Get boat images from folder
  const boatImages = id ? getBoatById(id) : null;
  // Get boat details from database
  const boatDetails = id ? boatDatabase[id] : null;

  // Debug logging
  if (boatImages && id === 'sunday-kinga') {
    console.log('Sunday Kinga Debug:', {
      boatImages: boatImages.boatImages,
      boatImagesCount: boatImages.boatImages?.length || 0,
      interiors: boatImages.interiors,
      interiorsCount: boatImages.interiors?.length || 0,
      mainImage: boatImages.image
    });
  }

  // Combine boat images and details
  const boat = boatImages && boatDetails ? {
    ...boatDetails,
    galleryImages: [
      ...(boatImages.boatImages && boatImages.boatImages.length > 0 
        ? boatImages.boatImages 
        : boatImages.image ? [boatImages.image] : []), // Fallback to main image if boatImages array is empty
      ...(boatImages.interiors || [])    // Then add interior images
    ].filter(Boolean), // Remove any undefined/null values
  } : null;

  // Debug final gallery
  if (boat && id === 'sunday-kinga') {
    console.log('Final gallery images:', boat.galleryImages.length, boat.galleryImages);
  }

  if (!boat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-spartan" style={{ fontSize: 'clamp(1.5rem, 6vw, 60px)' }}>Boat Not Found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const currentUrl = window.location.href;
    const showCopiedFeedback = () => {
      setLinkCopied(true);
      toast({ title: "Link copied", description: "The boat link is in your clipboard." });
      window.setTimeout(() => setLinkCopied(false), 2000);
    };

    navigator.clipboard
      .writeText(currentUrl)
      .then(showCopiedFeedback)
      .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
        showCopiedFeedback();
    });
  };

  const handleBookNow = () => {
    navigate("/booking", { state: { preselectedCatamaranId: boat.id } });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % boat.galleryImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + boat.galleryImages.length) % boat.galleryImages.length);
  };

  // Touch handlers for swipe navigation on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - next image
        nextImage();
      } else {
        // Swipe right - previous image
        prevImage();
      }
    }
    
    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Handle scroll tracking for horizontal scrollable section
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScrollability = () => {
      const canScrollHorizontally = container.scrollWidth > container.clientWidth;
      setCanScroll(canScrollHorizontally);
    };

    const handleScroll = () => {
      if (container.scrollWidth > container.clientWidth) {
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth - container.clientWidth;
        const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
        setScrollProgress(progress);
        
        // Check if at start or end
        const atStart = scrollLeft <= 5; // Small threshold for smooth transition
        const atEnd = scrollLeft >= scrollWidth - 5;
        setIsAtStart(atStart);
        setIsAtEnd(atEnd);
      } else {
        setScrollProgress(0);
        setIsAtStart(true);
        setIsAtEnd(true);
      }
    };

    const handleResize = () => {
      checkScrollability();
      handleScroll();
    };

    checkScrollability();
    handleScroll(); // Initial check
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [boat]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs sm:text-sm md:text-base"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left Side - Main Image */}
          <div className="space-y-3 sm:space-y-4 w-full">
            <div 
              className="relative aspect-[4/3] bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden w-full touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={boat.galleryImages[selectedImageIndex]}
                alt={boat.name}
                className="w-full h-full object-cover"
              />
              {/* Navigation Arrows */}
              {boat.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg transition-all z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg transition-all z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-900" />
                  </button>
                </>
              )}
            </div>

            {/* Photo Gallery */}
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900">
                  PHOTOS FOUND {boat.galleryImages.length}
                </h3>
              </div>
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide w-full snap-x snap-mandatory scroll-smooth">
                {boat.galleryImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md overflow-hidden border-2 transition-all snap-start ${
                      selectedImageIndex === index
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1 sm:ring-offset-2"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${boat.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Information Panel */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full overflow-x-hidden">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className={[
                  "flex items-center justify-center gap-0 md:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9 md:h-auto w-8 sm:w-9 md:w-auto aspect-square sm:aspect-auto transition-all",
                  linkCopied ? "border-green-300 bg-green-50 text-green-700 animate-pulse" : "",
                ].join(" ")}
                aria-label="Copy link"
              >
                {linkCopied ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
                <span className="hidden md:inline">{linkCopied ? "COPIED" : "COPY LINK"}</span>
              </Button>
            </div>

            {/* Boat Title */}
            <div className="w-full">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 break-words leading-tight font-quicksand" style={{ fontSize: 'clamp(1.25rem, 5vw, 50px)' }}>
                {boat.year} {boat.name}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 break-words">{boat.model}</p>
            </div>

            {/* Sections - Horizontal scroll on desktop, vertical on mobile */}
            <div className="border-t border-gray-200 pt-3 sm:pt-4 md:pt-6 w-full">
              <div 
                ref={scrollContainerRef}
                className="flex flex-col md:flex-row md:overflow-x-auto md:space-x-4 lg:space-x-6 space-y-4 md:space-y-0 pb-4 md:pb-2 scrollbar-hide w-full relative"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {/* Gradient fade indicators */}
                {canScroll && (
                  <>
                    {!isAtStart && (
                      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-300" />
                    )}
                    {!isAtEnd && (
                      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-300" />
                    )}
                  </>
                )}
                {/* Price List */}
                <div className="flex-shrink-0 w-full md:w-72 lg:w-80 space-y-2 sm:space-y-3 md:space-y-4 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">PRICE LIST</h3>
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 md:mb-2">Dar es Salaam</h4>
                      <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                        {boat.pricing?.dar?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-100 gap-2">
                            <span className="text-xs sm:text-sm text-gray-600 break-words flex-1 min-w-0">{item.type}</span>
                            <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 whitespace-nowrap flex-shrink-0">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 md:mb-2">Zanzibar</h4>
                      <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                        {boat.pricing?.zanzibar?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-100 gap-2">
                            <span className="text-xs sm:text-sm text-gray-600 break-words flex-1 min-w-0">{item.type}</span>
                            <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 whitespace-nowrap flex-shrink-0">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destinations */}
                <div className="flex-shrink-0 w-full md:w-72 lg:w-80 space-y-2 sm:space-y-3 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">DESTINATIONS</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {boat.destinations?.map((destination: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-900 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {destination}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Services Provided */}
                <div className="flex-shrink-0 w-full md:w-72 lg:w-80 space-y-2 sm:space-y-3 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">SERVICES PROVIDED</h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {boat.services?.map((service: string, index: number) => (
                      <li key={index} className="flex items-start gap-1.5 sm:gap-2">
                        <span className="text-gray-900 mt-0.5 sm:mt-1 text-xs sm:text-sm flex-shrink-0">•</span>
                        <span className="text-xs sm:text-sm text-gray-600 break-words flex-1">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Services */}
                {boat.additionalServices && boat.additionalServices.length > 0 && (
                  <div className="flex-shrink-0 w-full md:w-72 lg:w-80 space-y-2 sm:space-y-3 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">ADDITIONAL SERVICES IF AVAILABLE</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {boat.additionalServices.map((service: string, index: number) => (
                        <li key={index} className="flex items-start gap-1.5 sm:gap-2">
                          <span className="text-gray-900 mt-0.5 sm:mt-1 text-xs sm:text-sm flex-shrink-0">•</span>
                          <span className="text-xs sm:text-sm text-gray-600 break-words flex-1">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Scroll Indicator */}
              {canScroll && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  {/* Scroll progress bar */}
                  <div className="w-full max-w-md h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>
                  
                  {/* Scroll hint text */}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ChevronLeft className="h-3 w-3" />
                    <span>Swipe to see more</span>
                    <ChevronRight className="h-3 w-3" />
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pt-3 sm:pt-4 border-t border-gray-200 w-full">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">Description</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed break-words">{boat.description}</p>
              <Button
                type="button"
                onClick={handleBookNow}
                className="mt-3 w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatDetails;
