import { useEffect, useState } from "react";
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
  destination: z.string().min(1, "Please select a destination"),
  charter: z.string().min(1, "Please select a charter package"),
  date: z.string().min(1, "Please select a date"),
  passengers: z.string().min(1, "Please enter number of passengers"),
  food: z.array(z.string()).min(1, "Please select at least one food option"),
  drinks: z.array(z.string()).min(1, "Please select at least one drink option"),
  dj: z.boolean(),
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
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [djEnabled, setDjEnabled] = useState(false);
  const [selectedYacht, setSelectedYacht] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCharterType, setSelectedCharterType] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCatamaranId, setSelectedCatamaranId] = useState<string | null>(null);
  const catamaranCatalog = generateCatamaranCatalog();

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
      charter: "",
      passengers: "2",
      catamaran: "",
      allergies: "",
      specialOccasion: "",
    },
  });

  const watched = watch();

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

  const destinations = [
    { value: "dar-slipway", label: "Dar es Salaam - Slipway Marina" },
    { value: "zanzibar-stonetown", label: "Zanzibar - Stone Town" },
    { value: "nungwi", label: "Nungwi Beach" },
    { value: "bongoyo", label: "Bongoyo Island" },
    { value: "mbudya", label: "Mbudya Island" },
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
    const charterValue = `${location}|${selectedYacht}|${charterType}`;
    setValue("charter", charterValue);
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

  const handleNext = async () => {
    if (step === 1) {
      // Step 1: only validate personal details
      const isValid = await trigger(["name", "phone", "date", "passengers"]);
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      // Step 2: validate catalog-related choices
      const isValid = await trigger(["destination", "charter", "food", "drinks"]);
      if (isValid) {
        setStep(3);
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
    }
  };

  const onSubmit = (data: BookingForm) => {
    // Parse charter selection
    const [location, yacht, charterType] = data.charter.split("|");
    const selectedCharterOption = charterOptions
      .find((loc) => loc.location === location)
      ?.packages.find((pkg) => pkg.yacht === yacht)
      ?.options.find((opt) => opt.type === charterType);
    
    const catamaranLine = data.catamaran
      ? `\n🚤 *Selected Catamaran:*\n${data.catamaran}\n`
      : "";

    // Format WhatsApp message
    const message = `
🛥️ *NEW YACHT BOOKING REQUEST*

👤 *Customer Details:*
Name: ${data.name}
Phone: ${data.phone}

📍 *Destination:*
${destinations.find((d) => d.value === data.destination)?.label}

📅 *Date:* ${data.date}
👥 *Passengers:* ${data.passengers}

${catamaranLine}

⛵ *Selected Charter:*
${location} - ${yacht}
${charterType} ${selectedCharterOption ? selectedCharterOption.price : ""}

🍽️ *Food Selection:*
${data.food.join(", ")}

🍹 *Drinks Selection:*
${data.drinks.join(", ")}

🎵 *DJ Service:* ${data.dj ? "Yes ✓" : "No"}

${data.allergies ? `⚠️ *Allergies:*\n${data.allergies}\n` : ""}
${data.specialOccasion ? `🎉 *Special Occasion:*\n${data.specialOccasion}\n` : ""}

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
                      <h2 className="text-xl font-semibold text-gray-900 font-spartan">Yacht Catalog</h2>
                      <p className="text-sm text-gray-500">
                        Choose a catamaran and configure your experience.
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
                            <div className="ml-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">
                                +
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
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  <p className="text-sm font-medium text-gray-800">
                                    Capacity: {item.capacity}
                                  </p>
                                </div>
                              </div>

                              {/* Destination */}
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

                              {/* Food Options */}
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

                              {/* Drinks Options */}
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

                              {/* DJ Option */}
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
                        Destination:{" "}
                        {watched.destination
                          ? destinations.find((d) => d.value === watched.destination)?.label
                          : "Not selected"}
                      </p>
                      <p className="text-sm text-gray-700">
                        Charter: {watched.charter || "Not selected"}
                      </p>
                    </div>

                    {/* Food & extras */}
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
                    </div>

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
