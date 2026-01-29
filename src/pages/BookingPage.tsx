import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Utensils, Wine, Music, Ship, ChevronRight, ChevronLeft, Sparkles, Waves, Anchor } from "lucide-react";
import yachtImage from "@/assets/yatch-image.jpg";
import bookingImage1 from "@/assets/booking_image1.jpeg";
import bookingImage2 from "@/assets/booking_image2.jpeg";
import bookingImage3 from "@/assets/booking_image3 .jpeg";
import { getAllBoats } from "@/utils/boats";

// Charter pricing data
const charterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "20 Max Catamaran",
        options: [
          { type: "Half Day Charter", price: "$1,100" },
          { type: "Full Day Charter", price: "$1,500" },
          { type: "Live Onboard (24 Hours)", price: "$2,000" },
        ],
      },
      {
        yacht: "22 Max Catamaran",
        options: [
          { type: "Half Day Cruise", price: "$1,500" },
          { type: "Full Day Cruise", price: "$2,000" },
          { type: "Live Onboard (24 Hours)", price: "$2,600" },
        ],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "20 Max Catamaran",
        options: [
          { type: "Half Day Cruise", price: "$1,400" },
          { type: "Full Day Cruise", price: "$1,800" },
          { type: "Live Onboard (24 Hours)", price: "$2,200" },
        ],
      },
      {
        yacht: "22 Max Catamaran",
        options: [
          { type: "Half Day Cruise", price: "$1,800" },
          { type: "Full Day Cruise", price: "$2,400" },
          { type: "Live Onboard (24 Hours)", price: "$2,800" },
        ],
      },
    ],
  },
];

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  destination: z.string().optional(),
  charter: z.string().min(1, "Please select a charter package"),
  date: z.string().min(1, "Please select a date"),
  passengers: z.string().min(1, "Please enter number of passengers"),
  food: z.array(z.string()).optional(),
  drinks: z.array(z.string()).optional(),
  dj: z.boolean(),
  activities: z.array(z.string()).optional(),
  otherActivity: z.string().optional(),
  catamaran: z.string().optional(),
  allergies: z.string().optional(),
  specialOccasion: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const bookingImages = [yachtImage, bookingImage1, bookingImage2, bookingImage3];

const yachtTypes = ["20 Max Catamaran", "22 Max Catamaran"];

// Boat metadata for capacity and description
const boatMetadata: Record<string, { capacity: string; description: string }> = {
  "misbehaviour-catamaran": {
    capacity: "20 passengers",
    description: "20 passengers max, perfect for private cruises.",
  },
  "sunday-kinga": {
    capacity: "22 passengers",
    description: "22-passengers, ideal for group celebrations.",
  },
  "umoja": {
    capacity: "22 passengers",
    description: "22-passengers, comfortable for full-day trips.",
  },
  "albion-catamaran": {
    capacity: "20 passengers",
    description: "Premium catamaran with excellent facilities.",
  },
  "amani-luxury": {
    capacity: "25 passengers",
    description: "Luxury catamaran with premium amenities.",
  },
  "black-bird-heli": {
    capacity: "4 passengers",
    description: "Helicopter service for aerial tours and transfers.",
  },
  "butterfly-catamaran": {
    capacity: "22 passengers",
    description: "Elegant catamaran perfect for special occasions.",
  },
  "helia-44-catamaran": {
    capacity: "24 passengers",
    description: "Spacious 44-foot catamaran for comfortable cruising.",
  },
  "knlyps-catamaran": {
    capacity: "20 passengers",
    description: "Modern catamaran with excellent facilities.",
  },
  "queen-of-zanzibar": {
    capacity: "25 passengers",
    description: "Royal catamaran experience in Zanzibar waters.",
  },
  "seamanta-catamaran": {
    capacity: "22 passengers",
    description: "Comfortable catamaran for day trips.",
  },
  "vaatea-catamaran": {
    capacity: "24 passengers",
    description: "Luxury catamaran with premium features.",
  },
};

// Generate catalog from all boats
const generateCatamaranCatalog = () => {
  const allBoats = getAllBoats();
  return allBoats.map((boat) => {
    const metadata = boatMetadata[boat.id] || {
      capacity: "20 passengers",
      description: "Premium catamaran for your charter experience.",
    };
    return {
      id: boat.id,
      name: boat.name,
      description: `Description: ${metadata.description}`,
      capacity: metadata.capacity,
      image: boat.image,
    };
  });
};

const BookingPage = () => {
  const routerLocation = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [djEnabled, setDjEnabled] = useState(false);
  const [selectedYacht, setSelectedYacht] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCharterType, setSelectedCharterType] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCatamaranId, setSelectedCatamaranId] = useState<string | null>(null);
  const catamaranCatalog = useMemo(() => generateCatamaranCatalog(), []);
  const preselectedCatamaranId = (routerLocation.state as any)?.preselectedCatamaranId as
    | string
    | undefined;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bookingImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      dj: false,
      food: [],
      drinks: [],
      activities: [],
      otherActivity: "",
      charter: "",
      passengers: "2",
      catamaran: "",
      allergies: "",
      specialOccasion: "",
    },
  });

  const watched = watch();

  // If a user arrives from Boat Details, preselect that catamaran so Step 2 skips the "choose a catamaran" list.
  useEffect(() => {
    if (!preselectedCatamaranId) return;
    if (selectedCatamaranId) return;
    const found = catamaranCatalog.find((item) => item.id === preselectedCatamaranId);
    if (!found) return;

    setSelectedCatamaranId(found.id);
    setValue("catamaran", found.name);
  }, [preselectedCatamaranId, selectedCatamaranId, catamaranCatalog, setValue]);

  const foodOptions = [
    "Grilled Seafood Platter",
    "Fresh Lobster",
    "BBQ Selection",
    "Tropical Fruit Platter",
    "Gourmet Sandwiches",
    "Vegetarian Options",
  ];

  const drinkOptions = [
    "Premium Champagne",
    "Cocktails",
    "Fresh Juices",
    "Soft Drinks",
    "Wine Selection",
    "Beer & Spirits",
  ];

  const activityOptions = [
    "Sunbathing and relaxation",
    "Water sports (e.g., snorkeling, diving, paddleboarding)",
    "Dining at exclusive restaurants",
    "Private beach excursions",
    "Cultural experiences (e.g., visits to local villages, markets)",
    "Wine tasting and luxury dining onboard",
    "Family-friendly activities (e.g., kids’ clubs, educational tours)",
    "Romantic getaways (e.g., private dinners, sunset cruises)",
    "Other",
  ];

  const destinations = [
    { value: "slipway-bongoyo", label: "Slipway -bongoyo" },
    { value: "slipway-mbudya", label: "Slipway-mbudya" },
    { value: "slipway-fungu-ya-sini", label: "Slipway-fungu ya sini" },
    { value: "dar-oceean-view", label: "Dar -oceean view" },
    { value: "zanzibar-prison-island", label: "Zanzibar-prison island" },
    { value: "zanzibar-nakupenda", label: "Zanzibar -nakupenda" },
    { value: "zanzibar-oceaan-view", label: "Zanzibar oceaan view" },
  ];

  // Helicopter-specific pickup points
  const helicopterPickupPoints = [
    { value: "seacliff", label: "SEACLIFF" },
    { value: "seacliff-airport", label: "SEACLIFF/AIRPORT" },
  ];

  // Get prices for selected yacht
  const getYachtPrices = (yachtType: string) => {
    const darPkg = charterOptions[0].packages.find((pkg) => pkg.yacht === yachtType);
    const zanzibarPkg = charterOptions[1].packages.find((pkg) => pkg.yacht === yachtType);
    return {
      dar: darPkg?.options || [],
      zanzibar: zanzibarPkg?.options || [],
    };
  };

  const yachtPrices = selectedYacht ? getYachtPrices(selectedYacht) : { dar: [], zanzibar: [] };

  const handleYachtSelect = (yacht: string) => {
    setSelectedYacht(yacht);
    setSelectedLocation("");
    setSelectedCharterType("");
    setValue("charter", "");
  };

  const handleCharterSelect = (location: string, charterType: string) => {
    setSelectedLocation(location);
    setSelectedCharterType(charterType);
    // For helicopter services, don't include yacht in the charter value
    const charterValue = selectedCatamaranId === "black-bird-heli" 
      ? `${location}|${charterType}`
      : `${location}|${selectedYacht}|${charterType}`;
    setValue("charter", charterValue);

    // For helicopter, auto-set pickup point (no dropdown).
    if (selectedCatamaranId === "black-bird-heli") {
      const pickupPointValue =
        charterType === "Dar - Zanzibar (One Way)" || charterType === "Dar-Zanzibar (Two Ways)"
          ? "seacliff-airport"
          : "seacliff";
      setValue("destination", pickupPointValue);
    }
  };

  const handleFoodChange = (food: string, checked: boolean) => {
    const updated = checked
      ? [...selectedFood, food]
      : selectedFood.filter((f) => f !== food);
    setSelectedFood(updated);
    setValue("food", updated);
  };

  const handleDrinksChange = (drink: string, checked: boolean) => {
    const updated = checked
      ? [...selectedDrinks, drink]
      : selectedDrinks.filter((d) => d !== drink);
    setSelectedDrinks(updated);
    setValue("drinks", updated);
  };

  const handleActivitiesChange = (activity: string, checked: boolean) => {
    const updated = checked
      ? [...selectedActivities, activity]
      : selectedActivities.filter((a) => a !== activity);
    setSelectedActivities(updated);
    setValue("activities", updated);
  };

  const handleNext = async () => {
    if (step === 1) {
      // Step 1: only validate personal details
      const isValid = await trigger(["name", "phone", "date", "passengers"]);
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      // Step 2: validate catalog-related choices
      // For helicopter, destination is auto-set, and food/drinks are not required
      const fieldsToValidate = selectedCatamaranId === "black-bird-heli" 
        ? ["charter"]
        : ["destination", "charter"];
      
      // Validate required fields
      const isValid = await trigger(fieldsToValidate);
      
      // For non-helicopter, also validate food and drinks manually
      if (isValid && selectedCatamaranId !== "black-bird-heli") {
        const foodValid = watched.food && watched.food.length > 0;
        const drinksValid = watched.drinks && watched.drinks.length > 0;
        
        if (!foodValid || !drinksValid) {
          if (!foodValid) {
            setValue("food", [], { shouldValidate: true });
          }
          if (!drinksValid) {
            setValue("drinks", [], { shouldValidate: true });
          }
          return;
        }
      }
      
      if (isValid) {
        // Skip Step 3 (Personal Request) for helicopter bookings
        if (selectedCatamaranId === "black-bird-heli") {
          setStep(4);
        } else {
          setStep(3);
        }
      }
    } else if (step === 3) {
      // Step 3: Personal Request (no validation needed, optional fields)
      setStep(4);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSelectCatamaran = (id: string) => {
    const found = catamaranCatalog.find((item) => item.id === id);
    if (found) {
      setSelectedCatamaranId(id);
      setValue("catamaran", found.name);

      // For helicopter, we don't want the user to pick a "Destination" — set a sensible default.
      if (found.id === "black-bird-heli") {
        setValue("destination", "seacliff");
      } else {
        setValue("destination", "");
      }
    }
  };

  // Helper function to get helicopter price
  const getHelicopterPrice = (charterType: string): string => {
    const prices: Record<string, string> = {
      "Scenic Flights": "$1,000 (TZS 2,750,000)",
      "Hour Scenic Flight": "$2,500 (TZS 6,875,000)",
      "Dar - Zanzibar (One Way)": "$2,700 (TZS 7,425,000)",
      "Dar-Zanzibar (Two Ways)": "$3,500 (TZS 9,625,000)",
      "Special Charter": "Price upon Request"
    };
    return prices[charterType] || "";
  };

  const onSubmit = (data: BookingForm) => {
    // Parse charter selection (format differs for helicopter vs yacht)
    const charterParts = data.charter.split("|");
    const isHelicopter = selectedCatamaranId === "black-bird-heli";
    const location = charterParts[0];
    const yacht = isHelicopter ? "Helicopter" : charterParts[1];
    const charterType = isHelicopter ? charterParts[1] : charterParts[2];
    
    const selectedCharterOption = isHelicopter ? null : charterOptions
      .find((loc) => loc.location === location)
      ?.packages.find((pkg) => pkg.yacht === yacht)
      ?.options.find((opt) => opt.type === charterType);
    
    // Use unicode escape sequences for emojis to avoid encoding issues (showing as �).
    const EMOJI = {
      boatRequest: "\u{1F6E5}\u{FE0F}", // 🛥️
      customer: "\u{1F464}", // 👤
      pin: "\u{1F4CD}", // 📍
      calendar: "\u{1F4C5}", // 📅
      people: "\u{1F465}", // 👥
      catamaran: "\u{1F6A4}", // 🚤
      sailboat: "\u{26F5}", // ⛵
      food: "\u{1F37D}\u{FE0F}", // 🍽️
      drink: "\u{1F379}", // 🍹
      music: "\u{1F3B5}", // 🎵
      warning: "\u{26A0}\u{FE0F}", // ⚠️
      party: "\u{1F389}", // 🎉
      target: "\u{1F3AF}", // 🎯
      note: "\u{1F4DD}", // 📝
      check: "\u{2713}", // ✓
    } as const;
    
    const catamaranLine = data.catamaran
      ? `\n${EMOJI.catamaran} *Selected Catamaran:*\n${data.catamaran}\n`
      : "";

    const activitiesLine =
      data.activities && data.activities.length
        ? `\n${EMOJI.target} *Preferred Activities:*\n${data.activities.join(", ")}\n`
        : "";

    const otherActivityLine = data.otherActivity
      ? `\n${EMOJI.note} *Other Activity Preferences:*\n${data.otherActivity}\n`
      : "";

    const allergies = data.allergies?.trim();
    const specialOccasion = data.specialOccasion?.trim();
    const showAllergies = !!allergies && allergies.toLowerCase() !== "null";
    const showSpecialOccasion = !!specialOccasion && specialOccasion.toLowerCase() !== "null";

    // Format WhatsApp message
    const message = `
${EMOJI.boatRequest} *NEW YACHT BOOKING REQUEST*

${EMOJI.customer} *Customer Details:*
Name: ${data.name}
Phone: ${data.phone}

${EMOJI.pin} *${isHelicopter ? "Pickup Point" : "Destination"}:*
${isHelicopter 
  ? helicopterPickupPoints.find((d) => d.value === data.destination)?.label || data.destination
  : destinations.find((d) => d.value === data.destination)?.label}

${EMOJI.calendar} *Date:* ${data.date}
${EMOJI.people} *Passengers:* ${data.passengers}

${catamaranLine}

${EMOJI.sailboat} *Selected ${isHelicopter ? "Helicopter Service" : "Charter"}:*
${isHelicopter ? charterType : `${location} - ${yacht}`}
${isHelicopter ? getHelicopterPrice(charterType) : `${charterType} ${selectedCharterOption ? selectedCharterOption.price : ""}`}

${!isHelicopter ? `${EMOJI.food} *Food Selection:*\n${data.food.join(", ")}\n\n${EMOJI.drink} *Drinks Selection:*\n${data.drinks.join(", ")}\n\n${EMOJI.music} *DJ Service:* ${data.dj ? `Yes ${EMOJI.check}` : "No"}\n` : ""}

${showAllergies ? `${EMOJI.warning} *Allergies:*\n${allergies}\n` : ""}
${showSpecialOccasion ? `${EMOJI.party} *Special Occasion:*\n${specialOccasion}\n` : ""}
${activitiesLine}
${otherActivityLine}

Please contact the customer to provide a quote.
    `.trim();

    // WhatsApp number
    const whatsappNumber = "255711942057";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Booking Request Sent!",
      description: "We'll contact you shortly with a personalized quote.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="min-h-screen flex">
        {/* Left Side - Booking Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto w-full">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 font-spartan" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
                <span className="text-gray-900">Booking</span>{" "}
                <span className="text-gray-500">without stress</span>
              </h1>
              {/* Step Indicator */}
              <div className="flex gap-2 mt-4">
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? "bg-gray-900" : "bg-gray-300"}`}></div>
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? "bg-gray-900" : "bg-gray-300"}`}></div>
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 3 ? "bg-gray-900" : "bg-gray-300"}`}></div>
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 4 ? "bg-gray-900" : "bg-gray-300"}`}></div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-gray-50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              {/* Form Container with Slide Animation */}
              <div className="relative">
                {/* Step 1: Basic Information */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 1
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <form className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                        className={`bg-white border-gray-200 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+255 XXX XXX XXX"
                        {...register("phone")}
                        className={`bg-white border-gray-200 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Date and Passengers Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-gray-700 font-medium">
                          Departure Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          {...register("date")}
                          className={`bg-white border-gray-200 ${
                            errors.date ? "border-red-500" : ""
                          }`}
                        />
                        {errors.date && (
                          <p className="text-sm text-red-500">{errors.date.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passengers" className="text-gray-700 font-medium">
                          Passengers *
                        </Label>
                        <Input
                          id="passengers"
                          type="number"
                          min="1"
                          placeholder="2"
                          {...register("passengers")}
                          className={`bg-white border-gray-200 ${
                            errors.passengers ? "border-red-500" : ""
                          }`}
                        />
                        {errors.passengers && (
                          <p className="text-sm text-red-500">{errors.passengers.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Next Button */}
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                    >
                      Next <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </div>

                {/* Step 2: Catalog & Configuration */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 2
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <form className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-900 font-spartan">
                        {selectedCatamaranId === "black-bird-heli" ? "Helicopter" : "Yacht Catalog"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedCatamaranId === "black-bird-heli" 
                          ? "Choose a helicopter service and configure your experience."
                          : "Choose a catamaran and configure your experience."}
                      </p>
                    </div>

                    {/* Catalog List */}
                    {!selectedCatamaranId && (
                      <div className="space-y-4">
                        {catamaranCatalog.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectCatamaran(item.id)}
                            className="w-full flex items-center justify-between rounded-2xl bg-white px-3 py-3 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-left">
                                <h3 className="text-sm font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Selected catamaran configuration */}
                    {selectedCatamaranId && (
                      <div className="space-y-6">
                        {catamaranCatalog
                          .filter((item) => item.id === selectedCatamaranId)
                          .map((item) => (
                            <div key={item.id} className="space-y-4">
                              {/* Image + description */}
                              <div className="rounded-2xl overflow-hidden bg-white shadow-md">
                                <div className="w-full aspect-[4/3]">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-4 space-y-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {item.name}
                                  </h3>
                                  {item.id !== "black-bird-heli" && (
                                    <>
                                      <p className="text-sm text-gray-600">{item.description}</p>
                                      <p className="text-sm font-medium text-gray-800">
                                        Capacity: {item.capacity}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Destination (only for boats, not helicopter) */}
                              {item.id !== "black-bird-heli" && (
                                <div className="space-y-2">
                                  <Label htmlFor="destination" className="text-gray-700 font-medium">
                                    Destination *
                                  </Label>
                                  <Select onValueChange={(value) => setValue("destination", value)}>
                                    <SelectTrigger
                                      id="destination"
                                      className={`bg-white border-gray-200 ${
                                        errors.destination ? "border-red-500" : ""
                                      }`}
                                    >
                                      <SelectValue placeholder="Choose your departure location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {destinations.map((dest) => (
                                        <SelectItem key={dest.value} value={dest.value}>
                                          {dest.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors.destination && (
                                    <p className="text-sm text-red-500">
                                      {errors.destination.message}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Helicopter or Yacht Selection */}
                              {item.id === "black-bird-heli" ? (
                                <div className="space-y-4">
                                  <Label className="text-gray-700 font-medium">
                                    Select Helicopter Service *
                                  </Label>
                                  <div className="space-y-3">
                                    {/* Scenic Flights */}
                                    <button
                                      type="button"
                                      onClick={() => handleCharterSelect("Helicopter", "Scenic Flights")}
                                      className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedCharterType === "Scenic Flights"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                      }`}
                                    >
                                      <div className="font-semibold mb-2">Scenic Flights</div>
                                      <div className="text-lg font-bold mb-2">$1,000 <span className="text-sm font-normal">(TZS 2,750,000)</span></div>
                                      <ul className="text-sm space-y-1">
                                        <li>• 20 MINUTES FLIGHT</li>
                                        <li>• 4 PASSENGERS MAXIMUM</li>
                                        <li>• PICKUP POINT: SEACLIFF</li>
                                      </ul>
                                    </button>

                                    {/* Hour Scenic Flight */}
                                    <button
                                      type="button"
                                      onClick={() => handleCharterSelect("Helicopter", "Hour Scenic Flight")}
                                      className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedCharterType === "Hour Scenic Flight"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                      }`}
                                    >
                                      <div className="font-semibold mb-2">Hour Scenic Flight</div>
                                      <div className="text-lg font-bold mb-2">$2,500 <span className="text-sm font-normal">(TZS 6,875,000)</span></div>
                                      <ul className="text-sm space-y-1">
                                        <li>• 1 HOUR CRUISE</li>
                                        <li>• 4 PASSENGERS</li>
                                        <li>• PICKUP POINT: SEACLIFF</li>
                                      </ul>
                                    </button>

                                    {/* Dar - Zanzibar (One Way) */}
                                    <button
                                      type="button"
                                      onClick={() => handleCharterSelect("Helicopter", "Dar - Zanzibar (One Way)")}
                                      className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedCharterType === "Dar - Zanzibar (One Way)"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                      }`}
                                    >
                                      <div className="font-semibold mb-2">Dar - Zanzibar (One Way)</div>
                                      <div className="text-lg font-bold mb-2">$2,700 <span className="text-sm font-normal">(TZS 7,425,000)</span></div>
                                      <ul className="text-sm space-y-1">
                                        <li>• 1 HOUR CRUISE</li>
                                        <li>• ONE WAY</li>
                                        <li>• 4 PASSENGERS</li>
                                        <li>• PICKUP POINT: SEACLIFF/AIRPORT</li>
                                      </ul>
                                    </button>

                                    {/* Dar-Zanzibar (Two Ways) */}
                                    <button
                                      type="button"
                                      onClick={() => handleCharterSelect("Helicopter", "Dar-Zanzibar (Two Ways)")}
                                      className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedCharterType === "Dar-Zanzibar (Two Ways)"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                      }`}
                                    >
                                      <div className="font-semibold mb-2">Dar-Zanzibar (Two Ways)</div>
                                      <div className="text-lg font-bold mb-2">$3,500 <span className="text-sm font-normal">(TZS 9,625,000)</span></div>
                                      <ul className="text-sm space-y-1">
                                        <li>• TWO WAYS</li>
                                        <li>• WAITING TIME 2 HRS</li>
                                        <li>• 4 PASSENGERS</li>
                                        <li>• PICKUP POINT: SEACLIFF/AIRPORT</li>
                                      </ul>
                                    </button>

                                    {/* Special Charter */}
                                    <button
                                      type="button"
                                      onClick={() => handleCharterSelect("Helicopter", "Special Charter")}
                                      className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedCharterType === "Special Charter"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                      }`}
                                    >
                                      <div className="font-semibold mb-2">Special Charter</div>
                                      <div className="text-lg font-bold mb-2">Price upon Request</div>
                                      <ul className="text-sm space-y-1">
                                        <li>• SEND US PICKUP LOCATION AND DROPING POINT</li>
                                      </ul>
                                    </button>
                                  </div>
                                  {errors.charter && !selectedCharterType && (
                                    <p className="text-sm text-red-500">
                                      Please select a helicopter service
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {/* Yacht Selection & Charter Prices */}
                                  <div className="space-y-3">
                                    <Label className="text-gray-700 font-medium">
                                      Select Yacht *
                                    </Label>
                                    <div className="flex gap-3 flex-wrap">
                                      {yachtTypes.map((yacht) => (
                                        <button
                                          key={yacht}
                                          type="button"
                                          onClick={() => handleYachtSelect(yacht)}
                                          className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                                            selectedYacht === yacht
                                              ? "bg-gray-900 text-white"
                                              : "bg-white text-gray-700 hover:bg-gray-100"
                                          }`}
                                        >
                                          {yacht}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {selectedYacht && (
                                    <div className="space-y-4 animate-fade-in">
                                      <Label className="text-gray-700 font-medium">
                                        Select Charter Package *
                                      </Label>

                                      {/* Dar Prices */}
                                      <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                          Dar Yacht Charter
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2">
                                          {yachtPrices.dar.map((option, index) => (
                                            <button
                                              key={index}
                                              type="button"
                                              onClick={() =>
                                                handleCharterSelect("Dar Yacht Charter", option.type)
                                              }
                                              className={`p-3 rounded-lg text-sm transition-all ${
                                                selectedLocation === "Dar Yacht Charter" &&
                                                  selectedCharterType === option.type
                                                  ? "bg-gray-900 text-white"
                                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                              }`}
                                            >
                                              <div className="font-medium">{option.type}</div>
                                              <div className="text-xs mt-1 font-semibold">
                                                {option.price}
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Zanzibar Prices */}
                                      <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                          Zanzibar Charter
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2">
                                          {yachtPrices.zanzibar.map((option, index) => (
                                            <button
                                              key={index}
                                              type="button"
                                              onClick={() =>
                                                handleCharterSelect("Zanzibar Charter", option.type)
                                              }
                                              className={`p-3 rounded-lg text-sm transition-all ${
                                                selectedLocation === "Zanzibar Charter" &&
                                                  selectedCharterType === option.type
                                                  ? "bg-gray-900 text-white"
                                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                              }`}
                                            >
                                              <div className="font-medium">{option.type}</div>
                                              <div className="text-xs mt-1 font-semibold">
                                                {option.price}
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      {errors.charter && !selectedLocation && (
                                        <p className="text-sm text-red-500">
                                          Please select a charter package
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}

                              {/* Food Options (not for helicopter) */}
                              {item.id !== "black-bird-heli" && (
                                <div className="space-y-3">
                                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                                    <Utensils className="h-4 w-4" />
                                    Food Selection *
                                  </Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {foodOptions.map((food) => (
                                      <div
                                        key={food}
                                        className="flex items-center space-x-2 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                      >
                                        <Checkbox
                                          id={food}
                                          checked={selectedFood.includes(food)}
                                          onCheckedChange={(checked) =>
                                            handleFoodChange(food, checked as boolean)
                                          }
                                        />
                                        <Label
                                          htmlFor={food}
                                          className="text-sm text-gray-700 cursor-pointer flex-1"
                                        >
                                          {food}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  {errors.food && (
                                    <p className="text-sm text-red-500">{errors.food.message}</p>
                                  )}
                                </div>
                              )}

                              {/* Drinks Options (not for helicopter) */}
                              {item.id !== "black-bird-heli" && (
                                <div className="space-y-3">
                                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                                    <Wine className="h-4 w-4" />
                                    Drinks Selection *
                                  </Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {drinkOptions.map((drink) => (
                                      <div
                                        key={drink}
                                        className="flex items-center space-x-2 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                      >
                                        <Checkbox
                                          id={drink}
                                          checked={selectedDrinks.includes(drink)}
                                          onCheckedChange={(checked) =>
                                            handleDrinksChange(drink, checked as boolean)
                                          }
                                        />
                                        <Label
                                          htmlFor={drink}
                                          className="text-sm text-gray-700 cursor-pointer flex-1"
                                        >
                                          {drink}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  {errors.drinks && (
                                    <p className="text-sm text-red-500">{errors.drinks.message}</p>
                                  )}
                                </div>
                              )}

                              {/* DJ Option (not for helicopter) */}
                              {item.id !== "black-bird-heli" && (
                                <div className="p-4 rounded-lg bg-white border border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Music className="h-5 w-5 text-gray-700" />
                                      <div>
                                        <Label
                                          htmlFor="dj"
                                          className="text-gray-700 font-medium cursor-pointer"
                                        >
                                          Professional DJ Service
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                          Add music entertainment
                                        </p>
                                      </div>
                                    </div>
                                    <Switch
                                      id="dj"
                                      checked={djEnabled}
                                      onCheckedChange={(checked) => {
                                        setDjEnabled(checked);
                                        setValue("dj", checked);
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-full py-6 text-lg font-medium border-gray-300"
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                        disabled={!selectedCatamaranId}
                      >
                        Next
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Step 3: Personal Request */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 3
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <form className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-900 font-spartan">Personal Request</h2>
                      <p className="text-sm text-gray-500">
                        Share any special requirements or preferences for your booking.
                      </p>
                    </div>

                    {/* Activities / Experiences */}
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium">
                        What activities or experiences are important to you during your charter?
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-3">
                          {activityOptions.slice(0, 4).map((activity) => (
                            <div
                              key={activity}
                              className="flex items-center space-x-2 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={activity}
                                checked={selectedActivities.includes(activity)}
                                onCheckedChange={(checked) =>
                                  handleActivitiesChange(activity, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={activity}
                                className="text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {activity}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          {activityOptions.slice(4, 8).map((activity) => (
                            <div
                              key={activity}
                              className="flex items-center space-x-2 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={activity}
                                checked={selectedActivities.includes(activity)}
                                onCheckedChange={(checked) =>
                                  handleActivitiesChange(activity, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={activity}
                                className="text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {activity}
                              </Label>
                            </div>
                          ))}
                          {/* Other activity text field */}
                          <div className="space-y-2">
                            <Label htmlFor="otherActivity" className="text-sm text-gray-700 font-medium">
                              Other (please specify)
                            </Label>
                            <Input
                              id="otherActivity"
                              placeholder="Tell us about any other activities you’d like"
                              {...register("otherActivity")}
                              className="bg-white border-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-2">
                      <Label htmlFor="allergies" className="text-gray-700 font-medium">
                        What are your allergies?
                      </Label>
                      <Input
                        id="allergies"
                        placeholder="E.g., Nuts, Shellfish, Dairy"
                        {...register("allergies")}
                        className="bg-white border-gray-200"
                      />
                    </div>

                    {/* Special Occasion */}
                    <div className="space-y-2">
                      <Label htmlFor="specialOccasion" className="text-gray-700 font-medium">
                        Special occasion
                      </Label>
                      <Input
                        id="specialOccasion"
                        placeholder="E.g., Valentines, Birthday, Anniversary"
                        {...register("specialOccasion")}
                        className="bg-white border-gray-200"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-full py-6 text-lg font-medium border-gray-300"
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                      >
                        Next
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Step 4: Order Summary */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 4
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-900 font-spartan">Order Summary</h2>
                      <p className="text-sm text-gray-500">
                        Review your details before sending your booking request.
                      </p>
                    </div>

                    {/* Guest details */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900">Guest details</h3>
                      <p className="text-sm text-gray-700">
                        {watched.name || "Name not provided"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {watched.phone || "Phone not provided"}
                      </p>
                      <p className="text-sm text-gray-700">
                        Date: {watched.date || "Not selected"}
                      </p>
                      <p className="text-sm text-gray-700">
                        Passengers: {watched.passengers || "Not set"}
                      </p>
                    </div>

                    {/* Yacht & catalog */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900">Yacht & destination</h3>
                      <p className="text-sm text-gray-700">
                        Catamaran: {watched.catamaran || "Not selected"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {selectedCatamaranId === "black-bird-heli" ? "Pickup Point" : "Destination"}:{" "}
                        {watched.destination
                          ? (selectedCatamaranId === "black-bird-heli" 
                              ? helicopterPickupPoints.find((d) => d.value === watched.destination)?.label
                              : destinations.find((d) => d.value === watched.destination)?.label)
                          : "Not selected"}
                      </p>
                      <p className="text-sm text-gray-700">
                        Charter: {watched.charter || "Not selected"}
                      </p>
                    </div>

                    {/* Food & extras (not for helicopter) */}
                    {selectedCatamaranId !== "black-bird-heli" && (
                      <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">Services</h3>
                        <p className="text-sm text-gray-700">
                          Food:{" "}
                          {watched.food && watched.food.length
                            ? watched.food.join(", ")
                            : "No food selected"}
                        </p>
                        <p className="text-sm text-gray-700">
                          Drinks:{" "}
                          {watched.drinks && watched.drinks.length
                            ? watched.drinks.join(", ")
                            : "No drinks selected"}
                        </p>
                        <p className="text-sm text-gray-700">
                          DJ service: {watched.dj ? "Yes" : "No"}
                        </p>
                        {(watched.activities && watched.activities.length > 0) && (
                          <p className="text-sm text-gray-700">
                            Preferred activities: {watched.activities.join(", ")}
                          </p>
                        )}
                        {watched.otherActivity && (
                          <p className="text-sm text-gray-700">
                            Other activity preferences: {watched.otherActivity}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Personal Requests */}
                    {(watched.allergies || watched.specialOccasion) && (
                      <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">Personal Requests</h3>
                        {watched.allergies && (
                          <p className="text-sm text-gray-700">
                            Allergies: {watched.allergies}
                          </p>
                        )}
                        {watched.specialOccasion && (
                          <p className="text-sm text-gray-700">
                            Special Occasion: {watched.specialOccasion}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-2">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-full py-6 text-lg font-medium border-gray-300"
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Send booking
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image with Creative Overlays */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"></div>
          
          {/* Animated Circular Overlays */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gray-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gray-200/50 rounded-full blur-3xl animate-pulse-slower"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-100/30 rounded-full blur-3xl animate-pulse-slow"></div>
          
          {/* Floating Wave Decorations */}
          <div className="absolute top-20 right-10 w-32 h-32 text-gray-300/20 animate-float">
            <Waves className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 left-16 w-24 h-24 text-gray-300/20 animate-float-delayed">
            <Waves className="w-full h-full rotate-180" />
          </div>
          
          {/* Floating Anchor Icon */}
          <div className="absolute top-40 left-20 w-16 h-16 text-gray-400/30 animate-float-slow">
            <Anchor className="w-full h-full" />
          </div>
          
          {/* Floating Sparkles */}
          <div className="absolute top-1/3 right-32 w-12 h-12 text-yellow-400/40 animate-float">
            <Sparkles className="w-full h-full" />
          </div>
          <div className="absolute bottom-1/3 left-24 w-10 h-10 text-gray-400/40 animate-float-delayed">
            <Sparkles className="w-full h-full" />
          </div>
          
          {/* Image Container with Enhanced Styling */}
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="relative z-10 w-full max-w-lg">
              {/* Image with Glow Effect */}
              <div className="relative group">
                {/* Glow Effect Behind Image */}
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-400/20 via-gray-400/20 to-gray-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                
                {/* Main Image - Slideshow (fully automatic, no manual controls) */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500 w-full aspect-[16/9]">
                  <img
                    src={bookingImages[currentImageIndex]}
                    alt="Luxury Yacht"
                    className="w-full h-full object-cover transition-opacity duration-700"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Feature Badges */}
                <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float-slow">
                  <Sparkles className="w-4 h-4 text-gray-900" />
                  <span className="text-sm font-semibold text-gray-800">Luxury Experience</span>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float-delayed">
                  <Ship className="w-4 h-4 text-gray-900" />
                  <span className="text-sm font-semibold text-gray-800">Premium Fleet</span>
                </div>
              </div>
              
              {/* Inspirational Text Overlay */}
              <div className="mt-8 text-center animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Sail Into Luxury
                </h3>
                <p className="text-gray-600 text-sm">
                  Experience unforgettable moments on pristine waters
                </p>
              </div>
              
              {/* Decorative Dots */}
              <div className="absolute top-1/4 left-8 flex flex-col gap-4">
                <div className="w-3 h-3 rounded-full bg-gray-400/40 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400/40 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300/40 animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="absolute bottom-1/4 right-8 flex flex-col gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400/40 animate-ping" style={{ animationDelay: '1.5s' }}></div>
                <div className="w-3 h-3 rounded-full bg-gray-400/40 animate-ping" style={{ animationDelay: '2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300/40 animate-ping" style={{ animationDelay: '2.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
