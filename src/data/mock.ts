export type Recipe = {
  id: string;
  name: string;
  kcal: number;
  protein: number; // grams
  prepTimeMin: number;
  equipmentRequired: string[]; // e.g., ["oven"], [] means no-equipment
  dietaryTags: string[]; // ["vegetarian", "vegan", "gluten-free", ...]
  costPerServing: number; // dollars (mock)
  category: string; // breakfast/lunch/dinner/snack
  ingredients: string[];
  steps: string[];
  vitamins: string[];
  allergyTags: string[];
};

export type Exercise = {
  id: string;
  name: string;
  durationMin: number;
  intensity: "low" | "medium" | "high";
  equipment: string[]; // [] for no-equipment
  bodyFocus: string; // e.g., "full body"
  steps: string[];
  cues: string[];
  space: "tiny-room" | "normal";
};

export const recipes: Recipe[] = [
  {
    id: "oats-1",
    name: "5-min Protein Oats",
    kcal: 380,
    protein: 28,
    prepTimeMin: 5,
    equipmentRequired: [],
    dietaryTags: ["vegetarian"],
    costPerServing: 1.5,
    category: "breakfast",
    ingredients: ["oats", "milk", "protein powder", "banana"],
    steps: ["Mix", "Microwave 2 min", "Top and eat"],
    vitamins: ["B1", "Iron"],
    allergyTags: ["gluten", "dairy"],
  },
  {
    id: "salad-1",
    name: "Chickpea Crunch Salad",
    kcal: 420,
    protein: 22,
    prepTimeMin: 10,
    equipmentRequired: [],
    dietaryTags: ["vegan", "gluten-free"],
    costPerServing: 2.2,
    category: "lunch",
    ingredients: ["chickpeas", "greens", "tomato", "olive oil"],
    steps: ["Rinse", "Chop", "Toss"],
    vitamins: ["C", "K"],
    allergyTags: [],
  },
  {
    id: "wrap-1",
    name: "Air-Fryer Chicken Wrap",
    kcal: 520,
    protein: 38,
    prepTimeMin: 15,
    equipmentRequired: ["air-fryer"],
    dietaryTags: [],
    costPerServing: 3.5,
    category: "dinner",
    ingredients: ["tortilla", "chicken", "yogurt", "lettuce"],
    steps: ["Air-fry chicken", "Assemble wrap"],
    vitamins: ["B6"],
    allergyTags: ["gluten", "dairy"],
  },
  {
    id: "pasta-veg-1",
    name: "8-min Veg Pasta",
    kcal: 480,
    protein: 20,
    prepTimeMin: 12,
    equipmentRequired: ["oven"],
    dietaryTags: ["vegetarian"],
    costPerServing: 2.8,
    category: "dinner",
    ingredients: ["pasta", "veg mix", "sauce"],
    steps: ["Boil pasta", "Heat sauce", "Combine"],
    vitamins: ["A"],
    allergyTags: ["gluten"],
  },
  {
    id: "tofu-bowl-1",
    name: "Tofu Power Bowl",
    kcal: 510,
    protein: 32,
    prepTimeMin: 18,
    equipmentRequired: [],
    dietaryTags: ["vegan", "gluten-free"],
    costPerServing: 3.0,
    category: "dinner",
    ingredients: ["tofu", "rice", "broccoli", "sauce"],
    steps: ["Sear tofu", "Steam broccoli", "Assemble"],
    vitamins: ["C", "E"],
    allergyTags: ["soy"],
  },
  {
    id: "eggs-quick-1",
    name: "Quick Egg Toast",
    kcal: 350,
    protein: 21,
    prepTimeMin: 7,
    equipmentRequired: [],
    dietaryTags: ["vegetarian"],
    costPerServing: 1.7,
    category: "breakfast",
    ingredients: ["eggs", "bread", "spinach"],
    steps: ["Toast", "Scramble", "Stack"],
    vitamins: ["D"],
    allergyTags: ["gluten", "eggs"],
  },
  {
    id: "yogurt-bowl-1",
    name: "Yogurt Berry Bowl",
    kcal: 290,
    protein: 20,
    prepTimeMin: 3,
    equipmentRequired: [],
    dietaryTags: ["vegetarian", "gluten-free"],
    costPerServing: 1.9,
    category: "snack",
    ingredients: ["yogurt", "berries", "seeds"],
    steps: ["Combine ingredients"],
    vitamins: ["C"],
    allergyTags: ["dairy"],
  },
  {
    id: "bean-wrap-1",
    name: "No-Cook Bean Wrap",
    kcal: 430,
    protein: 24,
    prepTimeMin: 8,
    equipmentRequired: [],
    dietaryTags: ["vegan"],
    costPerServing: 2.0,
    category: "lunch",
    ingredients: ["tortilla", "beans", "salsa"],
    steps: ["Assemble and roll"],
    vitamins: ["B9"],
    allergyTags: ["gluten"],
  },
];

export const exercises: Exercise[] = [
  {
    id: "hit-10",
    name: "10-min No-Equip HIIT",
    durationMin: 10,
    intensity: "high",
    equipment: [],
    bodyFocus: "full body",
    steps: ["Jumping jacks", "Squats", "Lunges"],
    cues: ["Soft landings", "Neutral spine"],
    space: "tiny-room",
  },
  {
    id: "walk-20",
    name: "20-min Brisk Walk",
    durationMin: 20,
    intensity: "low",
    equipment: [],
    bodyFocus: "cardio",
    steps: ["Warm up", "Brisk pace", "Cool down"],
    cues: ["Relax shoulders"],
    space: "normal",
  },
  {
    id: "bands-15",
    name: "15-min Band Circuit",
    durationMin: 15,
    intensity: "medium",
    equipment: ["bands"],
    bodyFocus: "upper",
    steps: ["Rows", "Press", "Curls"],
    cues: ["Control tempo"],
    space: "tiny-room",
  },
  {
    id: "dumbbell-15",
    name: "DB Full Body",
    durationMin: 15,
    intensity: "medium",
    equipment: ["dumbbells"],
    bodyFocus: "full body",
    steps: ["Squat press", "Row", "RDL"],
    cues: ["Flat back"],
    space: "normal",
  },
  {
    id: "core-8",
    name: "8-min Core Quickie",
    durationMin: 8,
    intensity: "medium",
    equipment: [],
    bodyFocus: "core",
    steps: ["Plank", "Dead bug", "Side plank"],
    cues: ["Brace core"],
    space: "tiny-room",
  },
  {
    id: "mobility-12",
    name: "12-min Mobility Flow",
    durationMin: 12,
    intensity: "low",
    equipment: [],
    bodyFocus: "mobility",
    steps: ["Cat-cow", "World's greatest", "T-spine"],
    cues: ["Smooth breathing"],
    space: "tiny-room",
  },
];
