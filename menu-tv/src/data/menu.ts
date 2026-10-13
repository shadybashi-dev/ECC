import type {
  Category,
  Dish,
  Menu,
  PromoLine,
  Restaurant,
  Tag,
} from '../types';

/**
 * Menu content transcribed from the two menu-board photos supplied by the user.
 * Edit this file to update the TV board; unknown restaurant details are intentionally
 * left blank rather than filled with fictional contact information.
 */

export const restaurant: Restaurant = {
  name: 'PIZZA MENU',
  tagline: 'Build it your way · Find a new favorite',
  currency: '$',
  // Add the restaurant's real online ordering URL here to enable the QR panel.
};

const buildYourOwn: Dish[] = [
  {
    id: 'build-your-own',
    name: 'Build Your Own Pizza',
    desc: 'Choose your crust, sauce and toppings. 8-inch cheese pizza starts at $7.99.',
    price: 7.99,
    pricePrefix: 'FROM',
    image: '/img/pizza.jpg',
  },
];

const gourmetPizzas: Dish[] = [
  {
    id: 'house-combo',
    name: 'House Combo',
    desc: 'Original crust · red sauce · cheese · pepperoni · Canadian bacon · fresh mushrooms · yellow onions · black olives · bell peppers · sausage · chopped garlic · oregano',
    price: 13.99,
    pricePrefix: 'FROM',
    image: '/img/pizza.jpg',
  },
  {
    id: 'veggie-delight',
    name: 'Veggie Delight',
    desc: 'Original crust · red sauce · cheese · fresh mushrooms · yellow onions · black olives · bell peppers · artichoke hearts · fresh Roma tomatoes · chopped garlic · oregano',
    price: 13.99,
    pricePrefix: 'FROM',
    tags: ['veg'],
  },
  {
    id: 'meat-lovers',
    name: 'Meat Lovers',
    desc: 'Original crust · red sauce · cheese · pepperoni · Canadian bacon · bacon · sausage',
    price: 13.99,
    pricePrefix: 'FROM',
  },
  {
    id: 'california-veggie',
    name: 'California Veggie',
    desc: 'Sesame crust · white sauce · cheese · zucchini · spinach · artichoke hearts · fresh Roma tomatoes · chopped garlic · Parmesan · oregano · green onions',
    price: 13.99,
    pricePrefix: 'FROM',
    tags: ['veg'],
  },
  {
    id: 'mediterranean-delight',
    name: 'Mediterranean Delight',
    desc: 'Sesame crust · pesto sauce · cheese · black olives · artichoke hearts · feta · chopped garlic · oregano · sun-dried tomatoes',
    price: 13.99,
    pricePrefix: 'FROM',
    tags: ['veg'],
  },
  {
    id: 'margherita',
    name: 'Margherita',
    desc: 'Original crust · red sauce · cheese · fresh tomatoes · extra cheese · fresh basil',
    price: 13.99,
    pricePrefix: 'FROM',
    tags: ['veg'],
  },
  {
    id: 'bbq-chicken',
    name: 'BBQ Chicken',
    desc: 'Sesame crust · BBQ sauce · cheese · Canadian bacon · pineapple · red onion · BBQ chicken',
    price: 13.99,
    pricePrefix: 'FROM',
  },
  {
    id: 'roasted-garlic-chicken',
    name: 'Roasted Garlic Chicken',
    desc: 'Sesame crust · white sauce · cheese · fresh mushrooms · yellow onions · Roma tomatoes · chicken · roasted garlic · lemon pepper seasoning',
    price: 13.99,
    pricePrefix: 'FROM',
  },
  {
    id: 'chicken-pesto',
    name: 'Chicken Pesto',
    desc: 'Sesame crust · pesto sauce · cheese · fresh mushrooms · yellow onion · Roma tomatoes · chicken · chopped garlic · green onions',
    price: 13.99,
    pricePrefix: 'FROM',
  },
  {
    id: 'chicken-parm-spinach',
    name: 'Chicken Parm & Spinach',
    desc: 'Sesame crust · white sauce · cheese · spinach · chicken · bacon · roasted garlic · shredded Parmesan',
    price: 13.99,
    pricePrefix: 'FROM',
  },
  {
    id: 'paneer-pizza',
    name: 'Paneer Pizza',
    desc: 'Sesame crust · white sauce · cheese · red onion · bell peppers · jalapeño · paneer · mozzarella · Makhani drizzle',
    price: 13.99,
    pricePrefix: 'FROM',
    tags: ['veg'],
  },
];

const appetizers: Dish[] = [
  {
    id: 'buffalo-wings',
    name: 'Buffalo Wings',
    desc: 'Bone-in or boneless · Spicy, Garlic & Parm, Mild, BBQ, Lemon Pepper, Plain or Habanero',
    price: 11.99,
    pricePrefix: 'FROM',
    priceOptions: [
      { label: '8 pc', price: 11.99 },
      { label: '12 pc', price: 16.99 },
      { label: '16 pc', price: 20.99 },
      { label: '20 pc', price: 27.99 },
    ],
    image: '/img/wings.jpg',
    tags: ['spicy'],
  },
  {
    id: 'cheesy-bread',
    name: 'Cheesy Bread',
    price: 13.99,
    image: '/img/pizza.jpg',
  },
  {
    id: 'breadsticks',
    name: 'Breadsticks',
    price: 10.99,
    image: '/img/pasta.jpg',
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks',
    desc: '10 pieces',
    price: 9.99,
  },
  {
    id: 'jalapeno-poppers',
    name: 'Jalapeño Poppers',
    desc: '8 pieces',
    price: 8.99,
    tags: ['spicy'],
  },
  {
    id: 'potato-wedges',
    name: 'Potato Wedges',
    price: 7.99,
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    desc: '12 pieces',
    price: 7.99,
  },
  {
    id: 'chicken-strips',
    name: 'Chicken Strips',
    desc: '5 pieces',
    price: 8.99,
  },
  {
    id: 'dolma',
    name: 'Dolma',
    desc: '10 pieces',
    price: 7.99,
  },
];

const saladPrices = [
  { label: 'Medium', price: 9.99 },
  { label: 'Large', price: 10.99 },
];

const salads: Dish[] = [
  {
    id: 'garden-salad',
    name: 'Garden Salad',
    desc: 'Mixed greens · fresh Roma tomatoes · cucumber · cheese · croutons · oregano',
    price: 9.99,
    pricePrefix: 'FROM',
    priceOptions: saladPrices,
    image: '/img/salad.jpg',
    tags: ['veg'],
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    desc: 'Romaine lettuce · shredded Parmesan · croutons',
    price: 9.99,
    pricePrefix: 'FROM',
    priceOptions: saladPrices,
  },
  {
    id: 'house-antipasto',
    name: 'House Antipasto',
    desc: 'Mixed greens · fresh Roma tomatoes · black olives · Canadian bacon · artichoke hearts · cheese · oregano',
    price: 9.99,
    pricePrefix: 'FROM',
    priceOptions: saladPrices,
  },
  {
    id: 'spinach-salad',
    name: 'Spinach Salad',
    desc: 'Spinach · marinated artichoke hearts · feta · fresh Roma tomatoes · oregano',
    price: 9.99,
    pricePrefix: 'FROM',
    priceOptions: saladPrices,
    tags: ['veg'],
  },
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    desc: 'Mixed greens · fresh Roma tomatoes · cucumber · feta · Greek olives · red onion · oregano',
    price: 9.99,
    pricePrefix: 'FROM',
    priceOptions: saladPrices,
    image: '/img/salad.jpg',
    tags: ['veg'],
  },
];

const calzones: Dish[] = [
  {
    id: 'cheese-calzone',
    name: 'Cheese Calzone',
    desc: 'Add extra toppings or choose a gourmet calzone.',
    price: 11.99,
    pricePrefix: 'CHEESE',
    priceOptions: [
      { label: 'Extra toppings', price: 0.99 },
      { label: 'Gourmet', price: 14.99 },
    ],
    image: '/img/calzone.jpg',
  },
];

const pasta: Dish[] = [
  {
    id: 'ravioli-tortellini',
    name: 'Ravioli or Tortellini',
    desc: 'Choose marinara, Alfredo or creamy pesto. Comes with 4 breadsticks.',
    price: 14.99,
    priceOptions: [{ label: 'Chicken, sausage or shrimp', price: 2 }],
    image: '/img/pasta.jpg',
  },
  {
    id: 'lasagna',
    name: 'Lasagna',
    price: 13.99,
    image: '/img/pasta.jpg',
  },
];

const desserts: Dish[] = [
  {
    id: 'cinnamon-sticks',
    name: 'Cinnamon Sticks',
    price: 7.99,
    image: '/img/dessert.jpg',
  },
  {
    id: 'pizza-cookie',
    name: '8″ Pizza Cookie',
    price: 8.99,
  },
  {
    id: 'pizza-brownie',
    name: '8″ Pizza Brownie',
    price: 8.99,
    image: '/img/dessert.jpg',
  },
  {
    id: 'churros',
    name: 'Churros',
    desc: '4 pieces',
    price: 8.99,
  },
  {
    id: 'cannoli',
    name: 'Cannoli',
    price: 8.99,
    image: '/img/dessert.jpg',
  },
];

export const pizzaBuilder = {
  crusts: [
    'Original',
    'Sesame',
    'Stuffed Cheese',
    'Garlic',
    'Thick',
    'Thin',
    'Red Pepper',
    'Deep Dish',
    'Gluten-Free',
    'Cauliflower',
  ],
  sauces: ['Red', 'White', 'BBQ', 'Pesto', 'Buffalo', 'Pink'],
  toppings: [
    'Pepperoni',
    'Sausage',
    'Canadian Bacon',
    'Beef',
    'Salami',
    'Chicken',
    'Bacon',
    'Shrimp',
    'Anchovies',
    'Mushrooms',
    'Artichoke',
    'Tomatoes',
    'Spinach',
    'Black Olives',
    'Yellow Onions',
    'Green Onions',
    'Red Onions',
    'Bell Peppers',
    'Zucchini',
    'Pineapple',
    'Jalapeño',
    'Banana Peppers',
    'Chopped Garlic',
    'Roasted Garlic',
    'Feta Cheese',
    'Fresh Mozzarella',
    'Sun-Dried Tomatoes',
    'Basil',
  ],
  sizes: [
    { size: '8″', label: 'P', cheese: 7.99, extras: 0.99, gourmet: 13.99 },
    { size: '10″', label: 'Small', cheese: 10.99, extras: 1.45, gourmet: 15.99 },
    { size: '12″', label: 'Medium', cheese: 15.99, extras: 1.99, gourmet: 21.99 },
    { size: '14″', label: 'Large', cheese: 17.99, extras: 2.49, gourmet: 26.99 },
    { size: '16″', label: 'XL', cheese: 21.99, extras: 2.95, gourmet: 29.99 },
    { size: '22″', label: 'Giant', cheese: 35.99, extras: 4.99, gourmet: 49.99 },
    { size: '28″', label: 'Mega', cheese: 55.99, extras: 7.99, gourmet: 75.99 },
  ],
};

export const promo: PromoLine[] = [
  { id: 'p1', text: 'Build your own pizza · Choose your crust, sauce and toppings' },
  { id: 'p2', text: 'Explore 11 popular gourmet pizzas' },
  { id: 'p3', text: 'Buffalo wings · Bone-in or boneless · 8, 12, 16 or 20 pieces' },
  { id: 'p4', text: 'Salads available in Medium and Large' },
  { id: 'p5', text: 'Pasta comes with 4 breadsticks · Chicken, sausage or shrimp +$2' },
];

export const categories: Category[] = [
  {
    id: 'build-your-own',
    name: 'Build Your Own Pizza',
    tagline: 'Pick your crust · sauce · toppings · size',
    icon: 'pizza',
    accent: '#f2644b',
    items: buildYourOwn,
    pizzaBuilder,
  },
  {
    id: 'gourmet-pizzas',
    name: 'Popular Gourmet Pizzas',
    tagline: '11 house favorites · choose from 7 sizes',
    icon: 'pizza',
    accent: '#f5b544',
    items: gourmetPizzas,
  },
  {
    id: 'appetizers',
    name: 'Appetizers',
    tagline: 'Wings, shareables and sides',
    icon: 'flame',
    accent: '#ef6a5a',
    items: appetizers,
  },
  {
    id: 'salads',
    name: 'Salads',
    tagline: 'Choose Medium or Large',
    icon: 'salad',
    accent: '#8ed0a2',
    items: salads,
  },
  {
    id: 'calzones',
    name: 'Calzones',
    tagline: 'Cheese · extra toppings · gourmet',
    icon: 'pizza',
    accent: '#ffa257',
    items: calzones,
  },
  {
    id: 'pasta',
    name: 'Pasta',
    tagline: 'Served with 4 breadsticks',
    icon: 'soup',
    accent: '#7fd0d8',
    items: pasta,
  },
  {
    id: 'desserts',
    name: 'Desserts',
    tagline: 'A sweet finish',
    icon: 'dessert',
    accent: '#e9a3b6',
    items: desserts,
  },
];

export const menu: Menu = { restaurant, promo, categories };

export const tagLabels: Record<Tag, string> = {
  spicy: 'Spicy',
  veg: 'Vegetarian',
  new: 'New',
  chef: "Chef's Pick",
  bestseller: 'Popular',
};
