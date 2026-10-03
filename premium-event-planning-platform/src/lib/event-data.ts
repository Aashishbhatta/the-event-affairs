export type Category =
  | "Venues"
  | "Catering"
  | "DJ & Music"
  | "Decoration"
  | "Photography"
  | "Lighting"
  | "Clothing"
  | "Transportation"
  | "Entertainment";

export type Package = {
  name: string;
  price: number;
  description: string;
  features: string[];
};

export type Vendor = {
  id: string;
  name: string;
  category: Category;
  location: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  verified: boolean;
  available: boolean;
  image: string;
  tagline: string;
  description: string;
  services: string[];
  cancellationPolicy?: string;
  contactEmail?: string;
  packages: Package[];
};

export type EventDetails = {
  name: string;
  type: string;
  date: string;
  location: string;
  guests: number;
  budget: number;
  styles: string[];
  requirements: string[];
};

export type BudgetItem = {
  id: string;
  name: string;
  amount: number;
  color: string;
};

export type Guest = {
  id: string;
  name: string;
  email: string;
  status: "Confirmed" | "Pending" | "Declined";
};

export type EventTask = {
  id: string;
  label: string;
  done: boolean;
};

export type Booking = {
  id: string;
  vendorId: string;
  vendorName: string;
  category: Category;
  eventName: string;
  date: string;
  location: string;
  guests: number;
  packageName: string;
  baseAmount: number;
  customerFee: number;
  vendorFee: number;
  customerTotal: number;
  paid: number;
  dueDate: string;
  status: "Pending vendor" | "Confirmed" | "Declined";
  created: boolean;
};

const packageSet = (prices: [number, number, number], category: string): Package[] => [
  {
    name: "Essential",
    price: prices[0],
    description: `A considered ${category.toLowerCase()} experience, beautifully delivered.`,
    features: ["Thoughtful essentials", "Dedicated point of contact", "Event-day coordination"],
  },
  {
    name: "Signature",
    price: prices[1],
    description: "A little more detail, a lot more to remember.",
    features: ["Everything in Essential", "Personalised planning", "Premium finish & details"],
  },
  {
    name: "The Affair Edit",
    price: prices[2],
    description: "The full experience, tailored entirely around you.",
    features: ["Everything in Signature", "Bespoke experience", "Priority event-day team"],
  },
];

export const vendors: Vendor[] = [
  {
    id: "aura-events",
    name: "Aura Events & Catering",
    category: "Catering",
    location: "Ahmedabad",
    rating: 4.9,
    reviews: 128,
    startingPrice: 25000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1100&q=85",
    tagline: "A feast for every kind of togetherness.",
    description:
      "Thoughtful menus, warm service, and tables that invite people to linger. Aura brings a quietly special touch to celebrations of every size, from a close-knit dinner to a grand wedding feast.",
    services: ["Wedding catering", "Live counters", "Cocktail menus", "Dessert tables"],
    packages: packageSet([25000, 40000, 65000], "catering"),
  },
  {
    id: "velvet-grove",
    name: "The Velvet Grove",
    category: "Venues",
    location: "Ahmedabad",
    rating: 4.8,
    reviews: 86,
    startingPrice: 50000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=85",
    tagline: "A garden setting made for your story.",
    description:
      "An intimate garden estate tucked just beyond the city. The Velvet Grove pairs open-air charm with seamless hospitality, flexible spaces, and golden-hour views made for your favourite people.",
    services: ["Garden venue", "Indoor hall", "Bridal suite", "In-house coordination"],
    packages: packageSet([50000, 80000, 120000], "venue"),
  },
  {
    id: "soul-studio",
    name: "Soul Studio Decor",
    category: "Decoration",
    location: "Ahmedabad",
    rating: 4.9,
    reviews: 74,
    startingPrice: 18000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1100&q=85",
    tagline: "A room that feels unmistakably yours.",
    description:
      "A small, design-led studio creating layered celebrations with considered colour, flowers, and light. Every installation begins with your story—not a catalogue.",
    services: ["Floral styling", "Tablescapes", "Ceremony backdrops", "Bespoke installations"],
    packages: packageSet([18000, 32000, 52000], "decoration"),
  },
  {
    id: "afterglow-sounds",
    name: "Afterglow Sounds",
    category: "DJ & Music",
    location: "Ahmedabad",
    rating: 4.8,
    reviews: 92,
    startingPrice: 15000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1100&q=85",
    tagline: "Good music. Full dance floor. All night.",
    description:
      "A collective of DJs, selectors, and sound engineers with an instinct for reading the room. Expect a personal set, crisp sound, and a dance floor that fills itself.",
    services: ["DJ & sound", "Live musicians", "Custom playlists", "Dance-floor lighting"],
    packages: packageSet([15000, 25000, 42000], "music"),
  },
  {
    id: "golden-hour-films",
    name: "Golden Hour Films",
    category: "Photography",
    location: "Mumbai",
    rating: 5.0,
    reviews: 63,
    startingPrice: 20000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85",
    tagline: "The feeling, exactly as it was.",
    description:
      "Candid frames and honest films for the moments you will want to return to. A close-knit team with a documentary eye and a calming presence on the day.",
    services: ["Event photography", "Wedding films", "Portraits", "Same-day edits"],
    packages: packageSet([20000, 35000, 58000], "photography"),
  },
  {
    id: "lumen-lighting",
    name: "Lumen & Co.",
    category: "Lighting",
    location: "Ahmedabad",
    rating: 4.7,
    reviews: 48,
    startingPrice: 12000,
    verified: true,
    available: false,
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1100&q=85",
    tagline: "The glow everyone remembers.",
    description:
      "Architectural lighting, warm candlelight, and thoughtful technical production that transforms your venue from first arrival through the final song.",
    services: ["Ambient lighting", "Stage production", "Festoon lighting", "Technical production"],
    packages: packageSet([12000, 22000, 38000], "lighting"),
  },
  {
    id: "linen-and-lore",
    name: "Linen & Lore",
    category: "Clothing",
    location: "Jaipur",
    rating: 4.9,
    reviews: 55,
    startingPrice: 16000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85",
    tagline: "Beautifully dressed for the occasion.",
    description:
      "A thoughtful edit of occasionwear and tailored looks, curated with independent designers and a personal styling session for your celebration.",
    services: ["Personal styling", "Occasionwear", "Custom tailoring", "Accessories"],
    packages: packageSet([16000, 28000, 46000], "clothing"),
  },
  {
    id: "citylights-transit",
    name: "Citylights Transit",
    category: "Transportation",
    location: "Ahmedabad",
    rating: 4.8,
    reviews: 39,
    startingPrice: 9000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1100&q=85",
    tagline: "Getting there should feel like part of it.",
    description:
      "Comfortable, on-time guest transfers with considerate drivers and an operations team that takes the stress out of getting everyone together.",
    services: ["Guest shuttles", "Luxury cars", "Airport transfers", "Driver coordination"],
    packages: packageSet([9000, 18000, 32000], "transport"),
  },
  {
    id: "wonder-and-wild",
    name: "Wonder & Wild",
    category: "Entertainment",
    location: "Ahmedabad",
    rating: 4.9,
    reviews: 41,
    startingPrice: 14000,
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1100&q=85",
    tagline: "Little surprises, big smiles.",
    description:
      "Live acts, interactive moments, and joyful entertainment that gives your guests something to talk about on the way home.",
    services: ["Live performers", "Interactive acts", "Children's entertainment", "Hosts & MCs"],
    packages: packageSet([14000, 26000, 44000], "entertainment"),
  },
];

export const categories: Category[] = [
  "Venues",
  "Catering",
  "DJ & Music",
  "Decoration",
  "Photography",
  "Lighting",
  "Clothing",
  "Transportation",
  "Entertainment",
];

export const eventTypes = [
  "Wedding",
  "Birthday",
  "Farewell",
  "College Event",
  "Corporate Event",
  "Party",
  "Anniversary",
  "Other",
];

export const eventStyles = [
  "Simple",
  "Elegant",
  "Classy",
  "Luxury",
  "Party",
  "DJ Night",
  "Traditional",
  "Custom",
];

export const requirementOptions = [
  "Venue",
  "Catering",
  "DJ",
  "Decoration",
  "Lighting",
  "Photography",
  "Videography",
  "Clothing",
  "Transportation",
  "Entertainment",
];

export const initialEvent: EventDetails = {
  name: "Farewell Party",
  type: "Farewell",
  date: "2026-12-15",
  location: "Ahmedabad",
  guests: 150,
  budget: 200000,
  styles: ["Elegant", "Party"],
  requirements: ["Venue", "Catering", "DJ", "Decoration", "Photography", "Lighting", "Videography", "Transportation"],
};

export const initialBudgetItems: BudgetItem[] = [
  { id: "venue", name: "Venue", amount: 50000, color: "#273a32" },
  { id: "catering", name: "Catering", amount: 60000, color: "#bd9971" },
  { id: "dj", name: "DJ & Music", amount: 15000, color: "#798c7f" },
  { id: "decoration", name: "Decoration", amount: 25000, color: "#b57868" },
  { id: "photo", name: "Photography", amount: 15000, color: "#82979a" },
  { id: "lighting", name: "Lighting", amount: 10000, color: "#d1b776" },
  { id: "other", name: "Everything else", amount: 25000, color: "#c9c5bb" },
];

const guestNames = [
  "Ananya Mehta",
  "Arjun Shah",
  "Diya Patel",
  "Rohan Desai",
  "Meera Joshi",
  "Kabir Trivedi",
  "Isha Kapoor",
  "Vivaan Mehta",
  "Nisha Rao",
  "Aarav Bhatt",
  "Tara Gandhi",
  "Reyansh Vora",
  "Aditi Shah",
  "Ishaan Patel",
  "Myra Desai",
  "Zoya Mehta",
  "Dev Shah",
  "Kiara Joshi",
  "Neil Kapoor",
  "Sana Trivedi",
];

export const initialGuests: Guest[] = Array.from({ length: 150 }, (_, index) => {
  const number = index + 1;
  const name = guestNames[index % guestNames.length];
  const status = index < 113 ? "Confirmed" : index < 135 ? "Pending" : "Declined";
  return {
    id: `guest-${number}`,
    name: number <= guestNames.length ? name : `${name} · ${String(number).padStart(3, "0")}`,
    email: `${name.toLowerCase().replaceAll(" ", ".").replace("·", "")}@example.com`,
    status,
  };
});

const taskLabels = [
  "Book the perfect venue",
  "Finalize your guest list",
  "Confirm catering menu",
  "Book your DJ & sound",
  "Choose the event colour palette",
  "Confirm floral styling",
  "Send the save-the-dates",
  "Book your photographer",
  "Arrange guest transport",
  "Finalise the run of show",
  "Approve the invitation design",
  "Book lighting & production",
  "Plan the welcome experience",
  "Confirm accommodation options",
  "Choose your event outfits",
  "Arrange a sound check",
  "Approve the seating plan",
  "Send the formal invitations",
  "Confirm final guest count",
  "Brief your photographer",
  "Collect dietary requirements",
  "Check the weather plan",
  "Confirm vendor arrival times",
  "Prepare welcome signage",
  "Take a breath and enjoy it",
];

export const initialTasks: EventTask[] = taskLabels.map((label, index) => ({
  id: `task-${index + 1}`,
  label,
  done: index < 18,
}));

export const initialBookings: Booking[] = [
  {
    id: "TEA-26041",
    vendorId: "aura-events",
    vendorName: "Aura Events & Catering",
    category: "Catering",
    eventName: "Farewell Party",
    date: "2026-12-15",
    location: "Ahmedabad",
    guests: 150,
    packageName: "Signature",
    baseAmount: 60000,
    customerFee: 1500,
    vendorFee: 1500,
    customerTotal: 61500,
    paid: 6000,
    dueDate: "2026-12-01",
    status: "Confirmed",
    created: false,
  },
  {
    id: "TEA-26038",
    vendorId: "velvet-grove",
    vendorName: "The Velvet Grove",
    category: "Venues",
    eventName: "Farewell Party",
    date: "2026-12-15",
    location: "Ahmedabad",
    guests: 150,
    packageName: "Essential",
    baseAmount: 25000,
    customerFee: 625,
    vendorFee: 625,
    customerTotal: 25625,
    paid: 14000,
    dueDate: "2026-11-20",
    status: "Confirmed",
    created: false,
  },
  {
    id: "TEA-26043",
    vendorId: "aura-events",
    vendorName: "Aura Events & Catering",
    category: "Catering",
    eventName: "Aditi’s 40th Birthday",
    date: "2027-02-12",
    location: "Ahmedabad",
    guests: 90,
    packageName: "Signature",
    baseAmount: 40000,
    customerFee: 1000,
    vendorFee: 1000,
    customerTotal: 41000,
    paid: 4100,
    dueDate: "2027-01-29",
    status: "Pending vendor",
    created: false,
  },
];

export const currency = (amount: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(amount))}`;

export const formattedDate = (date: string) => {
  if (!date) return "Date to be confirmed";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

export const shortDate = (date: string) => {
  if (!date) return "Date to be confirmed";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(parsed);
};

export const createBudgetItems = (total: number): BudgetItem[] => {
  const ratios = [0.25, 0.3, 0.075, 0.125, 0.075, 0.05, 0.125];
  return initialBudgetItems.map((item, index) => ({
    ...item,
    amount: Math.round((total * ratios[index]) / 1000) * 1000,
  }));
};
