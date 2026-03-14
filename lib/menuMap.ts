// menuMap.ts
// Keys are the raw strings exactly as they appear in the source calendar data.
// Backslash-escaped commas (\,) have been normalized to plain commas.
// Duplicate-tag variants (e.g. "GF DF GF DF") are kept as separate keys.
//
// Tag semantics:
//   GF       – item is inherently gluten-free
//   DF       – item is inherently dairy-free
//   GF_AVAIL – a gluten-free version is available on request  ("GF avail")
//   DF_AVAIL – a dairy-free version is available on request   ("DF avail")
//   V        – item is from the vegetarian calendar

export type MenuTag = "GF" | "DF" | "GF_AVAIL" | "DF_AVAIL" | "V";

export interface SubItem {
  name: string;
  tags: MenuTag[];
}

export interface MenuOption {
  name: string;
  tags: MenuTag[];
  subItems: SubItem[];
}

export interface MenuItem {
  displayName: string;
  isAlternative: boolean;
  category: "entree" | "side";
  // Present when isAlternative === false
  tags?: MenuTag[];
  subItems?: SubItem[];
  // Present when isAlternative === true
  options?: MenuOption[];
}

export const MENU_MAP: Record<string, MenuItem> = {

  // ── PIZZA ─────────────────────────────────────────────────────────────────
  "Pepperoni Pizza": {
    displayName: "Pepperoni Pizza",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [],
  },
  "Cheese Pizza": {
    displayName: "Cheese Pizza",
    isAlternative: false,
    category: "entree",
    tags: ["V"],
    subItems: [],
  },

  // ── SAUCES & CONDIMENTS (sides) ───────────────────────────────────────────
  "Awesome Sauce GF DF": {
    displayName: "Awesome Sauce",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  // Duplicate-tag data artifact — treated identically
  "Awesome Sauce GF DF GF DF": {
    displayName: "Awesome Sauce",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  "Roasted Tomatillo Salsa GF DF": {
    displayName: "Roasted Tomatillo Salsa",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  "Roasted Green Chile Salsa GF DF": {
    displayName: "Roasted Green Chile Salsa",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  "Fresh Pico de Gallo GF DF": {
    displayName: "Fresh Pico de Gallo",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  "Charred Sweet Corn & Black Bean Salsa GF DF": {
    displayName: "Charred Sweet Corn & Black Bean Salsa",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  "Chimichurri GF DF": {
    displayName: "Chimichurri",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  "Strawberry Salsa GF DF": {
    displayName: "Strawberry Salsa",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },
  "Secret Sauce GF DF": {
    displayName: "Secret Sauce",
    isAlternative: false,
    category: "side",
    tags: ["GF", "DF"],
    subItems: [],
  },

  // ── GARLIC BREADSTICK SIDES ────────────────────────────────────────────────
  // Parenthetical indicates which entree this breadstick accompanies on that day
  "Garlic Breadstick (Macaroni & Cheese)": {
    displayName: "Garlic Breadstick",
    isAlternative: false,
    category: "side",
    tags: [],
    subItems: [],
  },
  "Garlic Breadstick (Spaghetti)": {
    displayName: "Garlic Breadstick",
    isAlternative: false,
    category: "side",
    tags: [],
    subItems: [],
  },
  "Garlic Breadstick (Secondary only)": {
    displayName: "Garlic Breadstick",
    isAlternative: false,
    category: "side",
    tags: [],
    subItems: [],
  },

  // ── MEAT / POULTRY ENTREES ────────────────────────────────────────────────

  // Hyphenated vs un-hyphenated are two distinct raw strings in the source data
  // Hot dog itself: GF_AVAIL (GF avail), DF — beans are inherently GF DF
  "All-Beef Hot Dog (GF avail) DF with BBQ Baked Beans GF DF": {
    displayName: "All-Beef Hot Dog",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF"],
    subItems: [
      { name: "BBQ Baked Beans", tags: ["GF", "DF"] },
    ],
  },
  "All Beef Hot Dog (GF avail) DF with BBQ Baked Beans GF DF": {
    displayName: "All-Beef Hot Dog",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF"],
    subItems: [
      { name: "BBQ Baked Beans", tags: ["GF", "DF"] },
    ],
  },

  "Oven fried Chicken DF with Biscuit": {
    displayName: "Oven Fried Chicken",
    isAlternative: false,
    category: "entree",
    tags: ["DF"],
    subItems: [
      { name: "Biscuit", tags: [] },
    ],
  },

  // Tacos: GF_AVAIL (GF avail), DF — salsa inherently GF DF
  "Pork Tacos Al Pastor (GF avail) DF with Pineapple Salsa GF DF": {
    displayName: "Pork Tacos Al Pastor",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF"],
    subItems: [
      { name: "Pineapple Salsa", tags: ["GF", "DF"] },
    ],
  },

  // Hamburger: GF_AVAIL (GF avail), DF — Cheeseburger has no labels — fries inherently GF DF
  // Two raw variants — one with a trailing duplicate "with Oven Baked Fries"
  "Hamburger (GF avail) DF or Cheeseburger with Oven Baked Fries GF DF with Oven Baked Fries": {
    displayName: "Burger",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Hamburger",
        tags: ["GF_AVAIL", "DF"],
        subItems: [{ name: "Oven Baked Fries", tags: ["GF", "DF"] }],
      },
      {
        name: "Cheeseburger",
        tags: [],
        subItems: [{ name: "Oven Baked Fries", tags: ["GF", "DF"] }],
      },
    ],
  },
  "Hamburger (GF avail) DF or Cheeseburger with Oven Baked Fries GF DF": {
    displayName: "Burger",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Hamburger",
        tags: ["GF_AVAIL", "DF"],
        subItems: [{ name: "Oven Baked Fries", tags: ["GF", "DF"] }],
      },
      {
        name: "Cheeseburger",
        tags: [],
        subItems: [{ name: "Oven Baked Fries", tags: ["GF", "DF"] }],
      },
    ],
  },

  "Chicken Strips DF with Biscuit": {
    displayName: "Chicken Strips",
    isAlternative: false,
    category: "entree",
    tags: ["DF"],
    subItems: [
      { name: "Biscuit", tags: [] },
    ],
  },

  // Tacos: GF_AVAIL (GF avail), DF
  "Chicken Fajita Tacos (GF avail) DF": {
    displayName: "Chicken Fajita Tacos",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF"],
    subItems: [],
  },

  // Nachos labeled "GF DF" directly — inherent, no avail
  // Single-space and double-space raw variants both exist in the source
  "Beef Nachos GF DF with Cheese Sauce or Shredded Cheese": {
    displayName: "Beef Nachos",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Beef Nachos with Cheese Sauce",
        tags: ["GF", "DF"],
        subItems: [],
      },
      {
        name: "Beef Nachos with Shredded Cheese",
        tags: ["GF", "DF"],
        subItems: [],
      },
    ],
  },
  "Beef Nachos GF DF with Cheese Sauce or  Shredded Cheese": {
    displayName: "Beef Nachos",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Beef Nachos with Cheese Sauce",
        tags: ["GF", "DF"],
        subItems: [],
      },
      {
        name: "Beef Nachos with Shredded Cheese",
        tags: ["GF", "DF"],
        subItems: [],
      },
    ],
  },

  "French Toast Casserole with Chicken Sausage GF DF and Berry Sauce GF DF": {
    displayName: "French Toast Casserole",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [
      { name: "Chicken Sausage", tags: ["GF", "DF"] },
      { name: "Berry Sauce", tags: ["GF", "DF"] },
    ],
  },

  "Oven Roast Chicken GF DF with Mashed Potatoes GF, Gravy & Biscuit": {
    displayName: "Oven Roast Chicken",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF"],
    subItems: [
      { name: "Mashed Potatoes", tags: ["GF"] },
      { name: "Gravy", tags: [] },
      { name: "Biscuit", tags: [] },
    ],
  },

  "Crispy Chicken Sandwich DF": {
    displayName: "Crispy Chicken Sandwich",
    isAlternative: false,
    category: "entree",
    tags: ["DF"],
    subItems: [],
  },

  "General Tso's Chicken Drumsticks GF DF with Veggie Fried Rice GF DF": {
    displayName: "General Tso's Chicken Drumsticks",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF"],
    subItems: [
      { name: "Veggie Fried Rice", tags: ["GF", "DF"] },
    ],
  },

  // Tacos: GF_AVAIL + DF_AVAIL — salsa is inherently GF DF
  "Beef Soft Tacos (GF avail, DF avail) & Housemade Salsa GF DF": {
    displayName: "Beef Soft Tacos",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF_AVAIL"],
    subItems: [
      { name: "Housemade Salsa", tags: ["GF", "DF"] },
    ],
  },

  // Tacos: GF_AVAIL (GF avail), DF — pico inherently GF DF
  "Choice Chefs Korean Bulgogi Beef Tacos (GF avail) DF with Cucumber Pico GF DF": {
    displayName: "Korean Bulgogi Beef Tacos",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF"],
    subItems: [
      { name: "Cucumber Pico", tags: ["GF", "DF"] },
    ],
  },

  // The pulled pork itself is labeled "GF DF" (inherent); the sandwich form has "(GF avail)"
  // so the bun has a GF option → GF, DF, GF_AVAIL all apply to the overall item
  "BBQ Pulled Pork GF DF Sandwich (GF avail) DF with Creamy Coleslaw GF DF": {
    displayName: "BBQ Pulled Pork Sandwich",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "GF_AVAIL"],
    subItems: [
      { name: "Creamy Coleslaw", tags: ["GF", "DF"] },
    ],
  },
  "BBQ Pulled Pork GF DF Sandwich (GF avail) DF": {
    displayName: "BBQ Pulled Pork Sandwich",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "GF_AVAIL"],
    subItems: [],
  },

  "Beef & Sausage Penne with Garlic Breadstick": {
    displayName: "Beef & Sausage Penne",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [
      { name: "Garlic Breadstick", tags: [] },
    ],
  },

  "HOTM Pizza: Taco Pizza with Local Legacy Ranch Ground Beef & Fresh Pico de Gallo": {
    displayName: "HOTM: Taco Pizza",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [],
  },

  // Spaghetti itself is DF; the "or" separates the protein topping
  "Spaghetti DF with Meatballs GF DF or Mozzarella GF": {
    displayName: "Spaghetti",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Spaghetti with Meatballs",
        tags: ["DF"],
        subItems: [{ name: "Meatballs", tags: ["GF", "DF"] }],
      },
      {
        name: "Spaghetti with Mozzarella",
        tags: ["DF"],
        subItems: [{ name: "Mozzarella", tags: ["GF"] }],
      },
    ],
  },

  "Chicken & Vegetable Teriyaki GF DF with Rice GF DF": {
    displayName: "Chicken & Vegetable Teriyaki",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF"],
    subItems: [
      { name: "Rice", tags: ["GF", "DF"] },
    ],
  },

  // Sub: GF_AVAIL + DF_AVAIL
  "Meatball Sub (GF avail, DF avail)": {
    displayName: "Meatball Sub",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF_AVAIL"],
    subItems: [],
  },

  "HOTM Pizza: Spring Veggie Pizza": {
    displayName: "HOTM: Spring Veggie Pizza",
    isAlternative: false,
    category: "entree",
    tags: ["V"],
    subItems: [],
  },

  "CHEF'S CHOICE": {
    displayName: "Chef's Choice",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [],
  },

  "Doro Wat Spicy Ethiopian Braised Chicken GF DF & Vegetables GF DF with Flatbread": {
    displayName: "Doro Wat (Ethiopian Braised Chicken)",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF"],
    subItems: [
      { name: "Vegetables", tags: ["GF", "DF"] },
      { name: "Flatbread", tags: [] },
    ],
  },

  "Iron Chef-Winning Super Cookers Asopao Puerto Rican Chicken and Rice Stew GF DF": {
    displayName: "Asopao (Puerto Rican Chicken & Rice Stew)",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF"],
    subItems: [],
  },

  "Beef Barbacoa Quesadilla with Pico de Gallo GF DF": {
    displayName: "Beef Barbacoa Quesadilla",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [
      { name: "Pico de Gallo", tags: ["GF", "DF"] },
    ],
  },

  // Sandwich: GF_AVAIL (GF avail), DF — slaw inherently GF DF
  "Spicy Korean Chicken Sandwich (GF avail) DF with Kimchi-style Slaw GF DF": {
    displayName: "Spicy Korean Chicken Sandwich",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF"],
    subItems: [
      { name: "Kimchi-style Slaw", tags: ["GF", "DF"] },
    ],
  },

  "Phở Gà Vietnamese Chicken Noodle Soup GF DF": {
    displayName: "Phở Gà Vietnamese Chicken Noodle Soup",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF"],
    subItems: [],
  },

  // Bowl has no inherent GF/DF label — tortilla has GF_AVAIL, pico & rice are inherently GF DF
  "Pork Green Chile Bowl with Tortilla (GF avail) & Pico de Gallo GF DF over Rice GF DF": {
    displayName: "Pork Green Chile Bowl",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [
      { name: "Tortilla", tags: ["GF_AVAIL"] },
      { name: "Pico de Gallo", tags: ["GF", "DF"] },
      { name: "Rice", tags: ["GF", "DF"] },
    ],
  },

  "Nashville Hot Chicken Sandwich DF with Bread & Butter Pickles GF DF": {
    displayName: "Nashville Hot Chicken Sandwich",
    isAlternative: false,
    category: "entree",
    tags: ["DF"],
    subItems: [
      { name: "Bread & Butter Pickles", tags: ["GF", "DF"] },
    ],
  },

  "Chicken Ramen DF": {
    displayName: "Chicken Ramen",
    isAlternative: false,
    category: "entree",
    tags: ["DF"],
    subItems: [],
  },

  "Grilled Chicken Pesto Pasta": {
    displayName: "Grilled Chicken Pesto Pasta",
    isAlternative: false,
    category: "entree",
    tags: [],
    subItems: [],
  },

  "Thai Red Curry Chicken GF DF over Rice GF DF": {
    displayName: "Thai Red Curry Chicken",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF"],
    subItems: [
      { name: "Rice", tags: ["GF", "DF"] },
    ],
  },

  // Hoagie: GF_AVAIL + DF_AVAIL — peppers inherently GF DF, provolone inherently GF
  "Italian Sausage Hoagie (GF avail, DF avail) with Roasted Red Peppers GF DF & Provolone GF": {
    displayName: "Italian Sausage Hoagie",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF_AVAIL"],
    subItems: [
      { name: "Roasted Red Peppers", tags: ["GF", "DF"] },
      { name: "Provolone", tags: ["GF"] },
    ],
  },

  // ── VEGETARIAN ENTREES (V tag) ────────────────────────────────────────────

  "Three Sisters Veggie Enchiladas GF": {
    displayName: "Three Sisters Veggie Enchiladas",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "V"],
    subItems: [],
  },

  "Fireside Broccoli Cheese Stuffed Potato GF with Biscuit": {
    displayName: "Broccoli Cheese Stuffed Potato",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "V"],
    subItems: [
      { name: "Biscuit", tags: [] },
    ],
  },

  "Bean & Cheese Pupusa GF with curtido GF DF": {
    displayName: "Bean & Cheese Pupusa",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "V"],
    subItems: [
      { name: "Curtido", tags: ["GF", "DF"] },
    ],
  },

  "Veggie Ramen DF": {
    displayName: "Veggie Ramen",
    isAlternative: false,
    category: "entree",
    tags: ["DF", "V"],
    subItems: [],
  },

  "Peanut-Free Tempeh Pad Thai GF DF": {
    displayName: "Peanut-Free Tempeh Pad Thai",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [],
  },

  // Nachos labeled "GF DF" directly — inherent, no avail
  // Single-space and double-space raw variants
  "Bean Nachos GF DF with Cheese Sauce or Shredded Cheese": {
    displayName: "Bean Nachos",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Bean Nachos with Cheese Sauce",
        tags: ["GF", "DF", "V"],
        subItems: [],
      },
      {
        name: "Bean Nachos with Shredded Cheese",
        tags: ["GF", "DF", "V"],
        subItems: [],
      },
    ],
  },
  "Bean Nachos GF DF with Cheese Sauce or  Shredded Cheese": {
    displayName: "Bean Nachos",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Bean Nachos with Cheese Sauce",
        tags: ["GF", "DF", "V"],
        subItems: [],
      },
      {
        name: "Bean Nachos with Shredded Cheese",
        tags: ["GF", "DF", "V"],
        subItems: [],
      },
    ],
  },

  "Plant Forward Bolognese GF DF with Garlic Breadstick": {
    displayName: "Plant Forward Bolognese",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [
      { name: "Garlic Breadstick", tags: [] },
    ],
  },

  "Sweet & Sour Tofu GF DF with Vegetables GF DF over Rice GF DF": {
    displayName: "Sweet & Sour Tofu",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [
      { name: "Vegetables", tags: ["GF", "DF"] },
      { name: "Rice", tags: ["GF", "DF"] },
    ],
  },

  // "Green Chile" vs "Chile" are two distinct raw strings from different calendar weeks
  "Green Chile & Cheese Tamales GF or Vegan Corn & Green Chile Tamales GF DF with Refried Beans GF DF": {
    displayName: "Chile Tamales",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Green Chile & Cheese Tamales",
        tags: ["GF", "V"],
        subItems: [{ name: "Refried Beans", tags: ["GF", "DF"] }],
      },
      {
        name: "Vegan Corn & Green Chile Tamales",
        tags: ["GF", "DF", "V"],
        subItems: [{ name: "Refried Beans", tags: ["GF", "DF"] }],
      },
    ],
  },
  "Green Chile & Cheese Tamales GF or Vegan Corn & Chile Tamales GF DF with Refried Beans GF DF": {
    displayName: "Chile Tamales",
    isAlternative: true,
    category: "entree",
    options: [
      {
        name: "Green Chile & Cheese Tamales",
        tags: ["GF", "V"],
        subItems: [{ name: "Refried Beans", tags: ["GF", "DF"] }],
      },
      {
        name: "Vegan Corn & Chile Tamales",
        tags: ["GF", "DF", "V"],
        subItems: [{ name: "Refried Beans", tags: ["GF", "DF"] }],
      },
    ],
  },

  "Chile Relleno Burrito with Refried Beans GF DF Smothered in Vegetarian Green Chili GF DF": {
    displayName: "Chile Relleno Burrito",
    isAlternative: false,
    category: "entree",
    tags: ["V"],
    subItems: [
      { name: "Refried Beans", tags: ["GF", "DF"] },
      { name: "Vegetarian Green Chili", tags: ["GF", "DF"] },
    ],
  },

  // Double-space before "Cilantro" preserved from source
  "Tofu Makhani GF DF over Rice GF DF with Flatbread & Spinach  Cilantro Chutney": {
    displayName: "Tofu Makhani",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [
      { name: "Rice", tags: ["GF", "DF"] },
      { name: "Flatbread", tags: [] },
      { name: "Spinach Cilantro Chutney", tags: [] },
    ],
  },

  // Sandwich: GF_AVAIL (GF avail) — bisque inherently GF DF
  "Toasted Cheese Sandwich (GF avail) with Tomato Bisque GF DF": {
    displayName: "Toasted Cheese Sandwich",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "V"],
    subItems: [
      { name: "Tomato Bisque", tags: ["GF", "DF"] },
    ],
  },

  "Macaroni & Cheese": {
    displayName: "Macaroni & Cheese",
    isAlternative: false,
    category: "entree",
    tags: ["V"],
    subItems: [],
  },

  "Cheese Ravioli with Garlic Breadstick": {
    displayName: "Cheese Ravioli",
    isAlternative: false,
    category: "entree",
    tags: ["V"],
    subItems: [
      { name: "Garlic Breadstick", tags: [] },
    ],
  },

  // Tacos: GF_AVAIL (GF avail), DF — slaw inherently GF DF
  "Tofu Chorizo Tacos (GF avail) DF with Radish Slaw GF DF": {
    displayName: "Tofu Chorizo Tacos",
    isAlternative: false,
    category: "entree",
    tags: ["GF_AVAIL", "DF", "V"],
    subItems: [
      { name: "Radish Slaw", tags: ["GF", "DF"] },
    ],
  },

  "L&J Red lentil dal GF DF over Rice GF DF": {
    displayName: "Red Lentil Dal",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [
      { name: "Rice", tags: ["GF", "DF"] },
    ],
  },

  // Standalone vegan tamale entry (no "or" — vegan only on this day)
  "Vegan Corn & Chile Tamales GF DF with Refried Beans GF DF": {
    displayName: "Vegan Corn & Chile Tamales",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [
      { name: "Refried Beans", tags: ["GF", "DF"] },
    ],
  },

  "Chickpea Masala GF DF with Rice GF DF & Flatbread": {
    displayName: "Chickpea Masala",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [
      { name: "Rice", tags: ["GF", "DF"] },
      { name: "Flatbread", tags: [] },
    ],
  },

  "Mediterranean Falafel GF DF & Quinoa Bowl GF DF with Creamy Cucumbers GF and Flatbread": {
    displayName: "Mediterranean Falafel & Quinoa Bowl",
    isAlternative: false,
    category: "entree",
    tags: ["GF", "DF", "V"],
    subItems: [
      { name: "Creamy Cucumbers", tags: ["GF"] },
      { name: "Flatbread", tags: [] },
    ],
  },
};
