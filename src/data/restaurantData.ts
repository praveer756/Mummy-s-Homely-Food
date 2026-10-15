export interface DishItem {
  id: string;
  name: string;
  marathiName: string;
  category: "thali" | "bhakri-sabzi" | "nashta" | "sweets-drinks";
  description: string;
  regionalOrigin: string;
  spiceLevel: 1 | 2 | 3 | 0; // 0 none, 1 mild, 2 medium, 3 fiery
  isVegetarian: boolean;
  priceNote?: string;
  image: string;
  tags: string[];
  signatureDish?: boolean;
}

export interface ThaliHotspot {
  id: string;
  name: string;
  marathiName: string;
  role: string;
  description: string;
  xPercent: number; // percentage coordinate on plate visual
  yPercent: number;
  highlightIngredients: string[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  marathiTitle: string;
  caption: string;
  image: string;
  category: "exterior" | "dining" | "details" | "food";
  highlight?: boolean;
}

export const RESTAURANT_DATA = {
  name: "Mummy’s Homely Food",
  marathiName: "मम्मीज होमली फूड",
  fullEntityName: "Nitin's Mummy's Homely Food",
  tagline: "Authentic Maharashtrian Flavours • Made with Heart",
  headlineQuote: "Some places feel like home.",
  storyHeadline: "Good food has a way of bringing us together.",
  ambianceCaption: "Simple surroundings. Warm lights. Good food. A place to feel at home.",
  
  // Real world location cues & verified placeholders
  location: {
    addressLine1: "Old Mumbai-Pune Highway / Roadside Countryside Stretch",
    addressLine2: "Near Scenic Green Hills, Maharashtra, India",
    landmark: "Look for the illuminated warm red neon sign & open-air thatched deck",
    mapsUrl: "https://maps.google.com/?q=Nitin's+Mummy's+Homely+Food",
    phoneDisplay: "+91 98230 00000 (Tap to Call)",
    phoneTel: "+919823000000",
    email: "namaste@mummyshomelyfood.in",
  },

  hours: {
    lunch: "11:30 AM – 4:00 PM",
    dinner: "7:00 PM – 11:30 PM",
    days: "Open All 7 Days (Including Festivals)",
    kitchenStatus: "Fresh Bhakris rolled & roasted to order",
  },

  features: [
    {
      title: "Charpai (खाट) Dining",
      description: "Sink into traditional woven rope cots with low wooden tables, dhaba style under the evening breeze.",
    },
    {
      title: "Two-Tier Open-Air Deck",
      description: "Breathe in the evening air on our upper covered deck surrounded by warm fairy string lights.",
    },
    {
      title: "Tawa-Fresh Hot Bhakris",
      description: "Hand-patted Jowar & Bajra flatbreads roasted over open flames with authentic charred aroma.",
    },
    {
      title: "Stone-Ground Spices",
      description: "Traditional Goda Masala and fiery crushed Thecha made with local garlic and chillies.",
    },
  ],

  pillars: [
    {
      number: "01",
      title: "Flavours of Maharashtra",
      marathi: "महाराष्ट्राची अस्सल चव",
      description:
        "Rooted in regional culinary wisdom—from the pungent roasted peanut-garlic profiles of Khandesh to the aromatic coconut-goda masala of Desh, and the tangy kokum freshness of the Konkan coast.",
      accent: "Authentic Regional Recipes",
    },
    {
      number: "02",
      title: "Comfort in Every Bite",
      marathi: "आईच्या हातची माया",
      description:
        "Every meal is prepared with the patience and care of a home kitchen. No commercial gravies or shortcuts. Hot yellow varan poured over rice with golden sajuk tup, just the way a mother serves it.",
      accent: "Piping Hot & Generous",
    },
    {
      number: "03",
      title: "A Place to Gather",
      marathi: "आपुलकीची हक्काची जागा",
      description:
        "Unpretentious, open to the night breeze, and lit by warm amber glow. Whether you stop on a long road trip or gather with entire extended family, there is always room at our tables.",
      accent: "Unpretentious Roadside Warmth",
    },
  ],

  thaliExperience: {
    headline: "A little bit of everything. A whole lot of love.",
    marathiHeadline: "घासात घास, आपुलकीचा सुवास",
    subtitle:
      "A comforting spread of authentic Maharashtrian dishes served on a traditional circular stainless steel thali, crafted to balance all six Ayurvedic tastes (Shad-Rasa).",
    hotspots: [
      {
        id: "bhakri",
        name: "Jowar Bhakri",
        marathiName: "गरमागरम ज्वारीची भाकरी",
        role: "The Heart of the Meal",
        description:
          "Hand-patted sorghum flatbread rolled thin and roasted over fierce tawa heat until blistered, puffing with sweet grain steam.",
        xPercent: 20,
        yPercent: 55,
        highlightIngredients: ["Local Jowar Flour", "Hot Water", "Clay Tawa Fire"],
      },
      {
        id: "pithla",
        name: "Steaming Pithla",
        marathiName: "झणझणीत पिठलं",
        role: "Maharashtrian Comfort",
        description:
          "Velvety golden besan (gram flour) curry tempered with crackling mustard seeds, curry leaves, hing, garlic, and green chillies.",
        xPercent: 38,
        yPercent: 38,
        highlightIngredients: ["Stone-ground Besan", "Curry Leaves", "Garlic Tadka", "Fresh Coriander"],
      },
      {
        id: "bharli-vangi",
        name: "Bharli Vangi",
        marathiName: "भरली वांगी",
        role: "Regional Classic",
        description:
          "Baby tender brinjals stuffed with slow-roasted peanuts, sesame seeds, coconut, and deeply fragrant homemade goda masala.",
        xPercent: 57,
        yPercent: 38,
        highlightIngredients: ["Baby Eggplants", "Roasted Peanuts", "Goda Masala", "Grated Coconut"],
      },
      {
        id: "varan-bhaat",
        name: "Varan Bhaat with Sajuk Toop",
        marathiName: "वरण भात आणि साजूक तूप",
        role: "The Soulful Foundation",
        description:
          "Tender cooked tuvar dal with a hint of turmeric poured over hot basmati rice, crowned with a melting dollop of pure golden cow ghee.",
        xPercent: 48,
        yPercent: 56,
        highlightIngredients: ["Tuvar Dal", "Fragrant Rice", "Pure Cow Ghee", "Turmeric"],
      },
      {
        id: "rassa",
        name: "Kolhapuri Kat / Rassa",
        marathiName: "कोल्हापुरी झणझणीत कट",
        role: "Bold & Fiery",
        description:
          "A crimson, aromatic thin curry (katachi amti) infused with roasted dry spices, red chillies, and tamarind-jaggery balance.",
        xPercent: 71,
        yPercent: 52,
        highlightIngredients: ["Lavangi Red Chillies", "Chana Dal Broth", "Roasted Spices", "Tamarind"],
      },
      {
        id: "kothimbir-vadi",
        name: "Crispy Kothimbir Vadi",
        marathiName: "कोथिंबीर वडी",
        role: "Savory Crunch",
        description:
          "Steamed rolls of fresh cilantro, gram flour, and toasted sesame, cut into medallions and crisp-fried to golden perfection.",
        xPercent: 38,
        yPercent: 78,
        highlightIngredients: ["Fresh Cilantro", "Gram Flour", "Sesame Seeds", "Ajwain"],
      },
      {
        id: "thecha",
        name: "Hirvi Mirchi Thecha",
        marathiName: "हिरवी मिरची खर्डा / ठेचा",
        role: "Rustic Highway Fire",
        description:
          "Fresh green chillies and garlic pods coarsely hand-pounded in an iron mortar with sea salt and roasted peanuts.",
        xPercent: 88,
        yPercent: 48,
        highlightIngredients: ["Green Chillies", "Garlic Pods", "Crushed Peanuts", "Rock Salt"],
      },
      {
        id: "solkadhi",
        name: "Chilled Solkadhi",
        marathiName: "थंडगार सोलकढी",
        role: "Digestive Nectar",
        description:
          "A pastel pink elixir pressed from wild kokum rinds and rich coconut milk, infused with crushed garlic and roasted cumin.",
        xPercent: 78,
        yPercent: 30,
        highlightIngredients: ["Wild Konkan Kokum", "Fresh Coconut Milk", "Garlic", "Roasted Cumin"],
      },
    ] as ThaliHotspot[],
  },
  menuDishes: [
    {
      id: "dish-special-chicken-thali",
      name: "Special Chicken Thali",
      marathiname: "स्पेशल चिकन थाळी",
      category: "thali",
      description: "A chicken thali meal. Confirm the exact sides and accompaniments with the restaurant.",
      regionalOrigin: "Maharashtrian-style thali",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/special-chicken-thali.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-chicken-handi",
      name: "Chicken Handi",
      marathiname: "चिकन हंडी",
      category: "curries-seafood-soups",
      description: "A chicken handi-style curry. Confirm the preparation and spice level with the restaurant.",
      regionalOrigin: "Indian",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/chicken-handi.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-non-veg-thali",
      name: "Non Veg Thali",
      marathiname: "नॉन-व्हेज थाळी",
      category: "thali",
      description: "A non-vegetarian thali. Confirm the meat selection and included accompaniments with the restaurant.",
      regionalOrigin: "Maharashtrian-style thali",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/non-veg-thali.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-bhakari",
      name: "Bhakari",
      marathiname: "भाकरी",
      category: "nashta",
      description: "Traditional bhakari flatbread. Confirm which grain is used for this version with the restaurant.",
      regionalOrigin: "Maharashtra",
      spiceLevel: 0,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/bhakari.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-prawns-fry",
      name: "Prawns Fry",
      marathiname: "कोळंबी फ्राय",
      category: "curries-seafood-soups",
      description: "Fried prawns with seasoning. Confirm the preparation and spice level with the restaurant.",
      regionalOrigin: "Seafood",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/prawns-fry.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-ukdiche-modak",
      name: "Ukdiche Modak",
      marathiname: "उकडीचे मोदक",
      category: "nashta",
      description: "A traditional steamed modak. Confirm the filling and serving details with the restaurant.",
      regionalOrigin: "Maharashtra",
      spiceLevel: 0,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/ukdiche-modak.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-paplet-fry",
      name: "Paplet Fry",
      marathiname: "पापलेट फ्राय",
      category: "curries-seafood-soups",
      description: "Fried pomfret. Confirm the preparation and portion size with the restaurant.",
      regionalOrigin: "Maharashtrian seafood",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/paplet-fry.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-masala-papad",
      name: "Masala Papad",
      marathiname: "मसाला पापड",
      category: "nashta",
      description: "Crisp papad with masala topping. Confirm toppings and ingredients with the restaurant.",
      regionalOrigin: "Indian snack",
      spiceLevel: 2,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/masala-papad.jpg",
      tags: [
        "Popular"
      ],
      signatureDish: false
    },
    {
      id: "dish-indrayani-rice",
      name: "Indrayani Rice",
      marathiname: "इंद्रायणी तांदूळ",
      category: "rice-biryani",
      description: "Indrayani rice, a rice variety associated with Maharashtra. Confirm the serving style and portion.",
      regionalOrigin: "Maharashtra",
      spiceLevel: 0,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/indrayani-rice.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-mutton-soup",
      name: "Mutton Soup",
      marathiname: "मटण सूप",
      category: "curries-seafood-soups",
      description: "Mutton soup. Confirm the recipe and spice level with the restaurant.",
      regionalOrigin: "Indian",
      spiceLevel: 2,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/mutton-soup.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-tea",
      name: "Tea",
      marathiname: "चहा",
      category: "sweets-drinks",
      description: "A cup of tea. Confirm the available preparation and serving size with the restaurant.",
      regionalOrigin: "Everyday favourite",
      spiceLevel: 0,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/tea.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-bhuna-chicken",
      name: "Bhuna Chicken",
      marathiname: "भुना चिकन",
      category: "curries-seafood-soups",
      description: "Chicken cooked bhuna-style. Confirm the restaurant's recipe and spice level.",
      regionalOrigin: "Indian",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/bhuna-chicken.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-chicken-biryani-rice",
      name: "Chicken Biryani Rice",
      marathiname: "चिकन बिर्याणी",
      category: "rice-biryani",
      description: "Chicken biryani rice. Confirm portion size and accompaniments with the restaurant.",
      regionalOrigin: "Indian",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/chicken-biryani-rice.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-paneer-masala",
      name: "Paneer Masala",
      marathiname: "पनीर मसाला",
      category: "curries-seafood-soups",
      description: "Paneer in masala gravy. Confirm ingredients and spice level with the restaurant.",
      regionalOrigin: "Indian",
      spiceLevel: 2,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/paneer-masala.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-rice-roti",
      name: "Rice Roti",
      marathiname: "तांदळाची भाकरी",
      category: "rice-biryani",
      description: "Rice-based roti. Confirm the preparation and grain used with the restaurant.",
      regionalOrigin: "Maharashtra / western India",
      spiceLevel: 0,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/rice-roti.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-mutton-masala",
      name: "Mutton Masala",
      marathiname: "मटण मसाला",
      category: "curries-seafood-soups",
      description: "Mutton cooked with masala. Confirm the preparation and spice level with the restaurant.",
      regionalOrigin: "Indian",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/mutton-masala.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-chicken-lollypop",
      name: "Chicken Lollypop",
      marathiname: "चिकन लॉलीपॉप",
      category: "nashta",
      description: "Chicken lollipop-style starter. Confirm the preparation and portion size with the restaurant.",
      regionalOrigin: "Indian starter",
      spiceLevel: 2,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/chicken-lollypop.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-paneer-paratha",
      name: "Paneer Paratha",
      marathiname: "पनीर पराठा",
      category: "nashta",
      description: "Paratha with paneer filling. Confirm accompaniments and preparation with the restaurant.",
      regionalOrigin: "Indian",
      spiceLevel: 1,
      isVegetarian: true,
      priceNote: "Confirm price",
      image: "/images/food/paneer-paratha.jpg",
      tags: [],
      signatureDish: false
    },
    {
      id: "dish-mutton-fry",
      name: "Mutton Fry",
      marathiname: "मटण फ्राय",
      category: "nashta",
      description: "Fried mutton preparation. Confirm the cut, portion, and spice level with the restaurant.",
      regionalOrigin: "Indian",
      spiceLevel: 3,
      isVegetarian: false,
      priceNote: "Confirm price",
      image: "/images/food/mutton-fry.jpg",
      tags: [],
      signatureDish: false
    },
  {
    id: "dish-fry-papad",
    name: "Fry Papad",
    marathiName: "तळलेला पापड",
    category: "nashta",
    description:
      "A traditional papad fried until golden and crisp, making a light, crunchy accompaniment to a Maharashtrian meal.",
    regionalOrigin: "Maharashtra",
    spiceLevel: 1,
    isVegetarian: true,
    image: "/images/food/fry-papad.jpg",
    tags: ["Snacks", "Crispy", "Classic"],
  },
  {
    id: "dish-roasted-papad",
    name: "Roasted Papad",
    marathiName: "भाजलेला पापड",
    category: "nashta",
    description:
      "A light, crunchy papad roasted until crisp, offering a simple traditional accompaniment with a delicious roasted flavour.",
    regionalOrigin: "Maharashtra",
    spiceLevel: 0,
    isVegetarian: true,
    image: "/images/food/roasted-papad.jpg",
    tags: ["Snacks", "Roasted", "Light"],
  },
  ] as DishItem[],

  gallery: [
    {
      id: "gal-hero-night",
      title: "The Glowing Night Exterior",
      marathiTitle: "रात्रीची विलोभनीय रोषणाई",
      caption:
        "Our illuminated neon sign shines bright against the evening sky, welcoming hungry travellers from the road into our courtyard.",
      image: "/images/restaurant/hero-exterior-night.jpg",
      category: "exterior",
      highlight: true,
    },
    {
      id: "gal-charpai-dining",
      title: "Charpai (खाट) Dining Experience",
      marathiTitle: "खाटेवर बसून जेवणाचा खराखुरा आनंद",
      caption:
        "Sit comfortably on handwoven rope cots with low wooden dining tables beneath natural timber rafters and bamboo pendant lanterns.",
      image: "/images/restaurant/dining-khat-charpai.jpg",
      category: "dining",
      highlight: true,
    },
    {
      id: "gal-staircase",
      title: "Rustic Deck Stairway",
      marathiTitle: "वरच्या मजल्याची सुंदर पायऱ्यांची वाट",
      caption:
        "Handcrafted wooden steps with festive painted balusters leading guests up to the open-air upper dining terrace.",
      image: "/images/restaurant/staircase-rustic.png",
      category: "details",
      highlight: false,
    },
    {
      id: "gal-panorama",
      title: "Two-Tier Roadside Sanctuary",
      marathiTitle: "हिरवळीत वसलेले आमचे दोन मजली रेस्टॉरंट",
      caption:
        "Surrounded by roadside trees, vintage garden benches on gravel, and twinkling festive lights stretching across the deck.",
      image: "/images/restaurant/exterior-panorama-night.jpg",
      category: "exterior",
      highlight: false,
    },
    {
      id: "gal-blender-isometric",
      title: "3D Architectural Cutaway (Hero Camera)",
      marathiTitle: "त्रिमितीय वास्तुरचना दर्शन",
      caption:
        "Procedural 3D Blender architectural reconstruction showcasing the two-tier structure, cutaway roof, illuminated signs, and transmission tower.",
      image: "/images/3d/blender-hero-exterior.png",
      category: "exterior",
      highlight: false,
    },
    {
      id: "gal-blender-entrance",
      title: "Ground Floor Entrance (CAM_GroundFloor_Interior)",
      marathiTitle: "प्रवेशद्वार आणि लाकडी पायऱ्या",
      caption:
        "Eye-level camera approaching the illuminated Mummy's Homely Food sign, railing balusters, and 17 timber stair steps.",
      image: "/images/3d/blender-ground-entrance.png",
      category: "details",
      highlight: false,
    },
    {
      id: "gal-blender-upper",
      title: "First-Floor Open Deck (CAM_FirstFloor_Interior)",
      marathiTitle: "पहिल्या मजल्यावरील मोकळी बैठक",
      caption:
        "Elevated perspective looking into the first-floor dining deck with slatted ceiling planks and woven pendant lamps.",
      image: "/images/3d/blender-upper-deck.png",
      category: "dining",
      highlight: false,
    },
    {
      id: "gal-thali-feast",
      title: "The Maharashtrian Feast",
      marathiTitle: "अस्सल महाराष्ट्रीयन जेवणाचा ताट",
      caption:
        "Every katori filled with regional joy: Bharli Vangi, golden Pithla, hot Bhakri, and cool pastel Solkadhi.",
      image: "/images/food/maharashtrian-thali.jpg",
      category: "food",
      highlight: true,
    },
  ] as GalleryPhoto[],
};
