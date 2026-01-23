import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Anchor, Ship, Utensils, Wine, Music, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Charter pricing data (shared with Pricing component)
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
        yacht: "25 Max Catamaran",
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
        yacht: "25 Max Catamaran",
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
  food: z.array(z.string()).min(1, "Please select at least one food option"),
  drinks: z.array(z.string()).min(1, "Please select at least one drink option"),
  dj: z.boolean(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const Booking = () => {
  const { toast } = useToast();
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [djEnabled, setDjEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      dj: false,
      food: [],
      drinks: [],
      charter: "",
    },
  });

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

  // Generate charter options for dropdown
  const getCharterOptions = () => {
    const options: { value: string; label: string }[] = [];
    charterOptions.forEach((location) => {
      location.packages.forEach((pkg) => {
        pkg.options.forEach((option) => {
          options.push({
            value: `${location.location}|${pkg.yacht}|${option.type}`,
            label: `${location.location} - ${pkg.yacht} - ${option.type} (${option.price})`,
          });
        });
      });
    });
    return options;
  };

  const charterDropdownOptions = getCharterOptions();

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

  const onSubmit = (data: BookingForm) => {
    // Parse charter selection
    const [location, yacht, charterType] = data.charter.split("|");
    const selectedCharterOption = charterOptions
      .find((loc) => loc.location === location)
      ?.packages.find((pkg) => pkg.yacht === yacht)
      ?.options.find((opt) => opt.type === charterType);
    
    // Format WhatsApp message
    const message = `
🛥️ *NEW YACHT BOOKING REQUEST*

👤 *Customer Details:*
Name: ${data.name}
Phone: ${data.phone}

📍 *Destination:*
${destinations.find((d) => d.value === data.destination)?.label}

⛵ *Selected Charter:*
${location} - ${yacht}
${charterType} ${selectedCharterOption ? selectedCharterOption.price : ""}

🍽️ *Food Selection:*
${data.food.join(", ")}

🍹 *Drinks Selection:*
${data.drinks.join(", ")}

🎵 *DJ Service:* ${data.dj ? "Yes ✓" : "No"}

Please contact the customer to provide a quote.
    `.trim();

    // WhatsApp number (format: country code + number without +)
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
    <section id="booking" className="py-20 bg-gradient-to-b from-background to-ocean-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Ship className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-spartan" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
            Book Your <span className="bg-gradient-ocean bg-clip-text text-transparent">Yacht Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Customize your luxury yacht charter with our premium services. Select your preferences and we'll provide a personalized quote.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-luxury bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">Customize Your Charter</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Fill in your details and preferences below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Anchor className="h-5 w-5 text-primary" />
                  Personal Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+255 XXX XXX XXX"
                      {...register("phone")}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Anchor className="h-5 w-5 text-primary" />
                  Select Destination *
                </h3>
                <Select onValueChange={(value) => setValue("destination", value)}>
                  <SelectTrigger className={errors.destination ? "border-destructive" : ""}>
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
                  <p className="text-sm text-destructive">{errors.destination.message}</p>
                )}
              </div>

              {/* Charter Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Ship className="h-5 w-5 text-primary" />
                  Select Charter Package *
                </h3>
                <Select onValueChange={(value) => setValue("charter", value)}>
                  <SelectTrigger className={errors.charter ? "border-destructive" : ""}>
                    <SelectValue placeholder="Choose your charter package" />
                  </SelectTrigger>
                  <SelectContent>
                    {charterDropdownOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.charter && (
                  <p className="text-sm text-destructive">{errors.charter.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Select from our available charter packages shown in the pricing section above.
                </p>
              </div>

              {/* Food Options */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  Food Selection *
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {foodOptions.map((food) => (
                    <div key={food} className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                      <Checkbox
                        id={food}
                        checked={selectedFood.includes(food)}
                        onCheckedChange={(checked) =>
                          handleFoodChange(food, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={food}
                        className="cursor-pointer text-foreground font-medium flex-1"
                      >
                        {food}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.food && (
                  <p className="text-sm text-destructive">{errors.food.message}</p>
                )}
              </div>

              {/* Drinks Options */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Wine className="h-5 w-5 text-primary" />
                  Drinks Selection *
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {drinkOptions.map((drink) => (
                    <div key={drink} className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                      <Checkbox
                        id={drink}
                        checked={selectedDrinks.includes(drink)}
                        onCheckedChange={(checked) =>
                          handleDrinksChange(drink, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={drink}
                        className="cursor-pointer text-foreground font-medium flex-1"
                      >
                        {drink}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.drinks && (
                  <p className="text-sm text-destructive">{errors.drinks.message}</p>
                )}
              </div>

              {/* DJ Option */}
              <div className="p-6 rounded-lg bg-gradient-ocean/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Music className="h-8 w-8 text-primary" />
                    <div>
                      <Label htmlFor="dj" className="text-lg font-semibold text-foreground cursor-pointer">
                        Professional DJ Service
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Add music entertainment to your charter
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

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-6 bg-gradient-ocean hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Send Booking Request via WhatsApp
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                By submitting, you'll be redirected to WhatsApp to complete your booking request. We'll respond with a personalized quote within 24 hours.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/255711942057"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 bg-gradient-ocean text-white rounded-full p-4 shadow-luxury hover:scale-110 transition-transform duration-300 group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-8 w-8" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with us
          </span>
        </a>
      </div>
    </section>
  );
};

export default Booking;
