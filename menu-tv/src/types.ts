/** Core types for the restaurant TV menu. */

export type Tag = 'spicy' | 'veg' | 'new' | 'chef' | 'bestseller';

export interface PriceOption {
  label: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  /** Optional short description shown beneath the dish name. */
  desc?: string;
  /** Main or starting price. */
  price: number;
  /** Previous price, used only when the menu has a real discount. */
  oldPrice?: number;
  /** Optional copy such as "FROM" or "CHEESE" shown before the price. */
  pricePrefix?: string;
  /** Size/add-on prices shown as a compact list on the dish card. */
  priceOptions?: PriceOption[];
  /** Path under public/img. */
  image?: string;
  /** Calories are optional and only shown when supplied by the restaurant. */
  kcal?: number;
  tags?: Tag[];
}

export interface PizzaSizePrice {
  size: string;
  label: string;
  cheese: number;
  extras: number;
  gourmet: number;
}

export interface PizzaBuilderOptions {
  crusts: string[];
  sauces: string[];
  toppings: string[];
  sizes: PizzaSizePrice[];
}

export type IconName =
  | 'salad'
  | 'flame'
  | 'sandwich'
  | 'pizza'
  | 'dessert'
  | 'drink'
  | 'offers'
  | 'soup'
  | 'breakfast';

export interface Category {
  id: string;
  name: string;
  tagline: string;
  icon: IconName;
  /** Category highlight color (HEX). */
  accent: string;
  items: Dish[];
  /** Adds the pizza-options and size-price-table layout for build-your-own. */
  pizzaBuilder?: PizzaBuilderOptions;
}

export interface PromoLine {
  id: string;
  text: string;
}

export interface Restaurant {
  /** Uses a neutral menu-board title until the restaurant name is provided. */
  name: string;
  tagline: string;
  currency: string;
  /** Optional real order URL. When omitted, no QR code is shown. */
  orderUrl?: string;
}

export type Menu = {
  restaurant: Restaurant;
  promo: PromoLine[];
  categories: Category[];
};
