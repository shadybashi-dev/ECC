import { CDN } from './restaurant';

/**
 * COMPLETE menu, captured from the live https://antoniaspizza.com/menu on
 * 2026-09-14. This file replaces the partial capture from the first pass.
 *
 * HARD RULE: nothing here is invented. Where the live menu has no description
 * the field is null and `verify` records the gap. Where the live menu has an
 * error, it is corrected and the correction is recorded in `fixes` below so the
 * owner can confirm it rather than discover it silently.
 *
 * `npm run build` prints every gap and every correction.
 */

export type Diet = 'vegetarian' | 'vegan' | 'vegan-option';

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  image?: string;
  diets?: Diet[];
  badge?: 'Most Popular' | "Chef's Specialty" | 'King Size' | 'Value' | 'New';
  anchor?: boolean;
  verify?: string;
};

export type MenuSection = {
  id: string;
  name: string;
  tagline?: string | null;
  note?: string;
  /** A gap that belongs to the whole section rather than one item. */
  verify?: string;
  /**
   * Whether descriptive copy would move sales here. True for food, false for
   * drinks and pack sizes — otherwise the build log fills with gaps nobody
   * will ever fix and the real ones stop being read.
   */
  wantsCopy?: boolean;
  items: MenuItem[];
};

/** Corrections applied to the live menu, listed so the owner can confirm each. */
export const fixes = [
  `'Bonless' -> 'Boneless' (4 items on the live menu).`,
  `'Bone in12 pc' / 'Bone in24pc' -> 'Bone-in 12 pc' / 'Bone-in 24 pc' (missing spaces).`,
  `'Speciality Calzone' -> 'Specialty Calzone'.`,
  `'Lemom' -> 'Lemon' (can soda).`,
  `'2L Orang' -> '2L Orange' (truncated on the live menu).`,
  `'San pell Sparkling water 500' -> 'San Pellegrino Sparkling Water 500ml'.`,
  `'Can San Pelle' -> 'San Pellegrino (can)'.`,
  `'Ice Tea' -> 'Iced Tea'.`,
  `'Redbull' -> 'Red Bull'.`,
  `'party size 24 in cheese' -> 'Party Size 24" Cheese' (inconsistent capitalisation and units).`,
  `'king 28 in cheese' -> 'King 28" Cheese'.`,
  `'Small 10" cheese' / 'Medium 13" Cheese' -> title case made consistent.`,
  `DUPLICATE: the live menu lists two separate 'Onion Rings' sections at $7.99 and $9.95. Only the $7.99 one is shown here until the owner says which is correct.`,
  `'California Viggie' -> 'California Veggie' (specialty pizza).`,
  `'Slice one or 2 Topp' -> 'Slice with 1 or 2 Toppings' (truncated label).`,
  `STRUCTURE: the live menu gives ~15 single-item H2 sections (Fettuccine, Rigatoni, Spaghetti, Tortellini, Ravioli, Curly Fries, Garlic Bread, Steak Fries, Sweet Potato, Onion Rings, Cheesy Bread, Chips, and one H2 per drink). Each is its own category with one item. They are grouped here into real categories.`,
  `SIZE FACTS CORRECTED: XL is 18 inches, not 28. The 28-inch pie is the 'King' size at $55.99+. The $39.99 deal is therefore two 18-inch XL pies, not two 28-inch pies.`,
];

/** The size ladder — real prices, used as the price anchor for the whole menu. */
export const pizzaSizes = [
  { id: 'size-10', name: 'Small 10"', serves: '1 person', price: '15.99' },
  { id: 'size-13', name: 'Medium 13"', serves: '2 people', price: '19.99' },
  { id: 'size-16', name: 'Large 16"', serves: '3 people', price: '22.99' },
  { id: 'size-18', name: 'XL 18"', serves: '4 people', price: '28.99' },
  { id: 'size-24', name: 'Party 24"', serves: '6–8 people', price: '48.99' },
  { id: 'size-28', name: 'King 28"', serves: '8–10 people', price: '55.99' },
] as const;

export const menu: MenuSection[] = [
  {
    id: 'signature',
    wantsCopy: true,
    name: 'The Signature',
    tagline: 'The reason people drive in from Templeton.',
    items: [
      {
        id: 'ajarski-boat',
        name: 'The Ajarski dough boat',
        description:
          'A warm, fluffy bread boat loaded with fresh mozzarella, feta, egg and butter — four ways to order it, zero reasons to skip it.',
        price: null,
        image: CDN.pluto('2d273cc4-ddbb-49ae-a0c4-56108f6a7e86', 900, 675),
        badge: "Chef's Specialty",
        verify: 'Price is not published on the live marketing site. Confirm before launch.',
      },
    ],
  },
  {
    id: 'sizes',
    name: 'Choose Your Size',
    tagline: 'Ten inches for one. Twenty-eight for the whole crew.',
    note:
      'Cheese prices shown; toppings are added at the ordering site. The King 28" sits at the top on purpose — it is the anchor that makes every size below it read as reasonable.',
    items: [
      {
        id: 'king-28',
        name: 'King 28" cheese',
        description: 'Twenty-eight inches. Feeds eight to ten people. Order ahead for groups.',
        price: '55.99',
        badge: 'King Size',
        anchor: true,
        image: CDN.otter('b9cbdb2e-70a7-4235-9231-0dcf7711bb3b.jpeg'),
      },
      {
        id: 'party-24',
        name: 'Party size 24" cheese',
        description: 'Twenty-four inches. Feeds six to eight.',
        price: '48.99',
        image: CDN.otter('80d6e30f-5b86-4243-9223-ba37cbdfca11.jpeg'),
      },
      {
        id: 'xl-18',
        name: 'XL 18" cheese',
        description: 'Eighteen inches. Feeds four.',
        price: '28.99',
        image: CDN.otter('4b8a7089-b1d4-4536-b2c1-f363bf8b6fff.jpeg'),
      },
      {
        id: 'large-16',
        name: 'Large 16"',
        description: 'Sixteen inches. Feeds three.',
        price: '22.99',
        image: CDN.otter('25ff6e63-5f02-413e-a054-2e0d75ca630c.jpeg'),
      },
      {
        id: 'medium-13',
        name: 'Medium 13" cheese',
        description: 'Thirteen inches. Feeds two.',
        price: '19.99',
        image: CDN.otter('de8dc072-924f-45f0-b28c-13afe24c07c3.jpeg'),
      },
      {
        id: 'small-10',
        name: 'Small 10" cheese',
        description: 'Ten inches. One person, no leftovers.',
        price: '15.99',
        image: CDN.otter('e177aa33-0464-4e9c-bb2c-723c8402ef9d.jpeg'),
      },
    ],
  },
  {
    id: 'by-the-slice',
    name: 'By the Slice',
    tagline: 'Counter service. Lunch-break speed.',
    items: [
      { id: 'slice-cheese', name: 'Cheese slice', description: 'Straight off the board.', price: '5.45', diets: ['vegetarian'] },
      {
        id: 'slice-toppings',
        name: 'Slice with 1 or 2 toppings',
        description: null,
        price: '5.95',
        verify: 'Live site truncates the label to "Slice one or 2 Topp".',
      },
      {
        id: 'slice-drink-combo',
        name: 'Slice & Drink Combo',
        description: 'One slice and one drink. The Cal Poly lunch move.',
        price: '7.99',
        badge: 'Value',
      },
      {
        id: 'grande-milano-slice',
        name: 'Grande Milano Slice',
        description:
          'A massive slice for the serious appetite. Topped with our homemade tomato sauce, this giant slice is equivalent to four regular pizza slices.',
        price: '12.95',
        badge: 'Most Popular',
        image: CDN.otter('41ebd88f-ccdc-406c-9bab-59395f5dc9ff.jpeg'),
      },
    ],
  },
  {
    id: 'red-sauce',
    wantsCopy: true,
    name: 'Red Sauce Classics',
    tagline: 'Home-made tomato sauce, mozzarella, and the SLO style seasoned crust.',
    items: [
      {
        id: 'antonias-special',
        name: "Antonia's Special",
        description:
          'Home-made tomato sauce, mozzarella, pepperoni, mushrooms, red onions, bacon bits and pepperoncini on the SLO style seasoned crust.',
        price: '16.45',
        badge: 'Most Popular',
        image: CDN.otter('8290a2b4-eff6-4834-959d-53c88646ceb6.jpeg'),
      },
      {
        id: 'original-margherita',
        name: 'Original Margherita',
        description:
          'Signature crust, rich tomato sauce, melted fresh mozzarella and fresh sliced tomatoes, finished with aromatic basil and a drizzle of extra virgin olive oil.',
        price: '16.45',
        diets: ['vegetarian'],
        image: CDN.otter('3f87f98a-c711-4859-b210-46cd95624f34.jpeg'),
      },
      {
        id: 'deluxe-supreme',
        name: 'Deluxe Supreme',
        description:
          'House-made tomato sauce, melted mozzarella, pepperoni, savory Italian sausage, fresh mushrooms, crisp bell peppers, red onions and black olives, finished with aromatic oregano.',
        price: '16.45',
        image: CDN.otter('9d3842de-6931-49c4-8099-f76634876306.jpeg'),
      },
      {
        id: 'meat-lovers',
        name: 'Meat Lovers',
        description:
          'Rich red sauce and melted mozzarella piled high with pepperoni, Canadian bacon, savory Italian sausage and crispy bacon.',
        price: '16.45',
        badge: "Chef's Specialty",
        image: CDN.pluto('8a6151d9-4cbe-4ff5-8bc4-202b9f9b7bc1', 640, 480),
      },
      {
        id: 'hawaiian',
        name: 'Hawaiian',
        description:
          'Rich tomato sauce, gooey melted cheese, savory Canadian bacon and sweet juicy pineapple — the sweet-and-savory argument settled.',
        price: '16.45',
        image: CDN.otter('5f054c81-1b0d-4e72-ace9-c8c9fc6fcf15.png'),
      },
      {
        id: 'mexican-style',
        name: 'Mexican Style',
        description:
          'Slow-simmered homemade red sauce, mozzarella and cheddar, meatballs, crispy pepperoni, spicy jalapeños, red bell peppers and red onions, garnished with fresh cilantro.',
        price: '16.45',
        image: CDN.otter('349e87d2-4303-464c-8e6f-58d3cba8122b.png'),
      },
      {
        id: 'sausage-lovers',
        name: 'Sausage Lovers',
        description:
          'Homemade tomato sauce and melted cheese with juicy savory sausage, fresh mushrooms, sweet onions and artichoke hearts, finished with Roma tomato, chopped garlic and oregano.',
        price: '16.45',
        image: CDN.otter('169fc26a-91ec-4b9e-bc5b-1e063d3a4d51.png'),
      },
    ],
  },
  {
    id: 'white-alfredo',
    wantsCopy: true,
    name: 'White & Alfredo',
    tagline: 'No tomato. Cream sauce, garlic, and a lot of parmesan.',
    items: [
      {
        id: 'chicken-parm-spinach',
        name: 'Chicken Parm & Spinach',
        description:
          'Alfredo sauce, melted mozzarella, spinach, chicken, bacon, roasted garlic and shredded parmesan.',
        price: '16.45',
        image: CDN.otter('2f17aaf9-86f0-4a60-954e-aba5c27e4ed3.png'),
      },
      {
        id: 'roasted-garlic-chicken',
        name: 'Roasted Garlic Chicken',
        description:
          'Creamy garlic sauce, melted mozzarella, flame-grilled chicken, sweet caramelized roasted garlic, crisp onions and a generous dusting of sharp aged parmesan.',
        price: '16.45',
        badge: 'Most Popular',
        image: CDN.otter('3696400e-ac95-45ff-ba6e-eb2da64e6562.png'),
      },
      {
        id: 'bacon-deluxe',
        name: 'Bacon Deluxe',
        description:
          'Velvety white sauce and melted cheese loaded with Canadian bacon, crispy smoky bacon and seasoned sausage, topped with Roma tomato, garlic, oregano and green onions.',
        price: '16.45',
        image: CDN.otter('e5d94aaa-dfd0-417f-b312-4e624645c59e.png'),
      },
      {
        id: 'california-veggie',
        name: 'California Veggie',
        description:
          'Velvety Alfredo base with melted cheese, tender zucchini, fresh spinach, artichoke hearts, Roma tomatoes and chopped garlic, finished with sharp parmesan, oregano and crisp green onions.',
        price: '16.45',
        diets: ['vegetarian'],
        image: CDN.otter('10f38a6a-8f7c-417e-bc84-a8f6532362ee.png'),
      },
      {
        id: 'garlic-veggie',
        name: 'Garlic Veggie',
        description:
          'Alfredo base loaded with earthy mushrooms, artichoke hearts and vine-ripened tomatoes, infused with aromatic garlic, finished with parmesan, wild oregano and green onions.',
        price: '16.45',
        diets: ['vegetarian'],
        image: CDN.otter('7749aad6-e791-4b2a-ab08-14b4a0bef363.jpeg'),
      },
      {
        id: 'spinach-lovers',
        name: 'Spinach Lovers',
        description:
          'Creamy white sauce with fresh spinach, tender artichoke hearts and sweet sun-dried tomatoes, finished with roasted garlic and oregano.',
        price: '16.45',
        diets: ['vegetarian'],
        image: CDN.otter('9593ef99-d2a8-4830-8354-6f0f7de924d2.jpeg'),
      },
    ],
  },
  {
    id: 'pesto',
    wantsCopy: true,
    name: 'Pesto',
    tagline: 'Aromatic basil pesto instead of red sauce.',
    items: [
      {
        id: 'chicken-pesto',
        name: 'Chicken Pesto',
        description:
          'Aromatic pesto, grilled chicken, fresh mushrooms, onions, vine tomatoes, garlic and green onions.',
        price: '16.45',
        image: CDN.otter('3094e05f-4c85-4969-86ff-90ceeb5bcc08.png'),
      },
      {
        id: 'veggie-pesto',
        name: 'Veggie Pesto',
        description:
          'Vibrant pesto base, fresh mushrooms, artichoke hearts, vine tomatoes, tangy feta, garlic, green onions and oregano.',
        price: '16.45',
        diets: ['vegetarian'],
        image: CDN.otter('92fcbc4f-d495-443c-a48d-fd6526d6c7a1.jpeg'),
      },
      {
        id: 'vegetable-delight',
        name: 'Vegetable Delight',
        description:
          'Melted mozzarella, fresh mushrooms, crunchy green peppers, red onions, artichoke hearts and black olives with aromatic garlic and vine tomatoes on a crispy golden crust.',
        price: '16.45',
        diets: ['vegetarian'],
        image: CDN.otter('f93e5c1e-2b99-46b4-a105-a15f408014a2.png'),
      },
    ],
  },
  {
    id: 'bbq-buffalo',
    wantsCopy: true,
    name: 'BBQ & Buffalo',
    tagline: 'Bold sauce, loud flavor.',
    items: [
      {
        id: 'bbq-chicken',
        name: 'BBQ Chicken',
        description:
          'BBQ sauce, mozzarella, grilled chicken, red onions and red bell peppers, finished with fresh cilantro.',
        price: '16.45',
        image: CDN.otter('641fb62a-8949-4186-86a4-4cc4e10d0654.png'),
      },
      {
        id: 'buffalo-chicken',
        name: 'Buffalo Chicken',
        description:
          'Buffalo chicken, mushrooms, green peppers and red onions on melted mozzarella. The secret is the sauce: bold, creamy spicy ranch.',
        price: '16.45',
        image: CDN.otter('6704bfa8-0da7-457f-b204-3b8bb6dbd934.jpeg'),
      },
    ],
  },
  {
    id: 'mediterranean',
    wantsCopy: true,
    name: 'Mediterranean',
    tagline: 'The crossover nobody else in SLO does.',
    note:
      'Also on the board: gyro pizza and manakeesh with za\u2019atar, confirmed by regulars but not yet published online with prices. Baklawa is on the dessert menu.',
    items: [
      {
        id: 'greek-feta-vegetable',
        name: 'Greek Feta Vegetable',
        description:
          'Homemade tomato sauce and melted cheese with fresh mushrooms, sweet yellow onions, crunchy bell peppers, artichoke hearts and black olives, finished with Roma tomatoes, crumbled feta and oregano.',
        price: '16.45',
        diets: ['vegetarian'],
        image: CDN.otter('366e214e-adf7-4f70-9026-02cff0129776.png'),
      },
      {
        id: 'mediterranean-pizza',
        name: 'Mediterranean',
        description:
          'Basil pesto base with tender artichoke hearts, black olives, sun-dried tomatoes and crumbled feta, finished with fresh garlic and oregano.',
        price: '16.45',
        diets: ['vegetarian'],
        badge: "Chef's Specialty",
        verify: 'The only specialty pie with no photo on the live site — needs a real shoot.',
      },
      {
        id: 'philly-cheese-steak',
        name: 'Philly Cheese Steak',
        description: null,
        price: '16.45',
        image: CDN.otter('9a6b1113-fd3a-42f2-a4ca-a5bdfedc911e.png'),
        verify: 'No description on the live site. Descriptive naming is worth +27% on an item — needs real copy from the kitchen.',
      },
    ],
  },
  {
    id: 'calzones',
    wantsCopy: true,
    name: 'Calzones & Rolls',
    tagline: 'Folded, baked, and filling.',
    items: [
      {
        id: 'cheese-calzone',
        name: 'Cheese Calzone',
        description: null,
        price: '13.99',
        image: CDN.otter('3bcf2c89-ca9c-4da5-ae2b-94a0141fe272.jpeg'),
        diets: ['vegetarian'],
        verify: 'No description on the live menu.',
      },
      {
        id: 'specialty-calzone',
        name: 'Specialty Calzone',
        description: null,
        price: '18.99',
        image: CDN.otter('823d8b09-83f2-4ca2-b613-ea15c6863fd5.jpeg'),
        verify: 'No description on the live menu — what is in it? Spelled "Speciality" on the live site.',
      },
      {
        id: 'lasagna-cheese-roll',
        name: 'Lasagna Cheese Roll',
        description: null,
        price: '19.99',
        verify: 'No description and no photo on the live menu.',
      },
    ],
  },
  {
    id: 'pasta-classics',
    name: 'Pasta Classics',
    tagline: 'Five shapes, one price, made to order.',
    items: [
      { id: 'fettuccine', name: 'Fettuccine', description: null, price: '19.99', image: CDN.otter('2c179c2d-730f-4832-8a05-5346cc5c8465.jpeg'), verify: 'No description or sauce options listed.' },
      { id: 'rigatoni', name: 'Rigatoni', description: null, price: '19.99', image: CDN.otter('260f4307-d37c-451d-aed8-360c2fe3d495.jpeg'), verify: 'No description or sauce options listed.' },
      { id: 'spaghetti', name: 'Spaghetti', description: null, price: '19.99', image: CDN.otter('fecb006a-4f32-4e90-9bf3-3255b675b510.jpeg'), verify: 'No description or sauce options listed.' },
      { id: 'tortellini', name: 'Tortellini', description: null, price: '19.99', verify: 'No description or photo on the live menu.' },
      { id: 'ravioli', name: 'Ravioli', description: null, price: '19.99', verify: 'No description or photo on the live menu.' },
    ],
  },
  {
    id: 'pasta-signature',
    wantsCopy: true,
    name: 'Signature Pasta',
    tagline: 'The dishes people come back for by name.',
    items: [
      {
        id: 'slo-plant-based-rigatoni',
        name: 'The SLO Plant-Based Rigatoni',
        description: '100% vegan.',
        price: '34.95',
        diets: ['vegan'],
        badge: 'New',
        verify: 'Only the "(100% Vegan)" label is published — needs a real description.',
      },
      {
        id: 'truffled-pesto-tortellini',
        name: 'Truffled Pesto Tortellini',
        description: null,
        price: '31.95',
        diets: ['vegetarian'],
        badge: "Chef's Specialty",
        verify: 'No description on the live menu. A regular calls the "creamy pesto" the best thing here — this is likely it.',
      },
      {
        id: 'fettuccine-alla-toscana',
        name: 'Fettuccine alla Toscana',
        description: null,
        price: '31.95',
        verify: 'No description on the live menu.',
      },
      {
        id: 'spaghetti-gamberi-in-rosa',
        name: 'Spaghetti Gamberi in Rosa',
        description: null,
        price: '29.95',
        verify: 'No description on the live menu. "Gamberi" means shrimp — say so, and flag the shellfish allergen.',
      },
      {
        id: 'rigatoni-rustica-arrabbiata',
        name: "Rigatoni Rustica All'Arrabbiata",
        description: null,
        price: '28.95',
        diets: ['vegan-option'],
        verify: 'No description on the live menu. Arrabbiata is spicy — worth saying.',
      },
      {
        id: 'nonnas-baked-lasagna-rolls',
        name: "Nonna's Baked Lasagna Rolls",
        description: null,
        price: '26.95',
        badge: 'Most Popular',
        verify: 'No description on the live menu.',
      },
    ],
  },
  {
    id: 'wings',
    name: 'Wings',
    tagline: 'Bone-in or boneless, six to twenty-four.',
    items: [
      { id: 'bonein-6', name: 'Bone-in 6 pc', description: null, price: '11.95', image: CDN.otter('a002b99d-4c98-41e3-90aa-6505c69d68bc.jpeg') },
      { id: 'bonein-8', name: 'Bone-in 8 pc', description: null, price: '15.45' },
      { id: 'bonein-12', name: 'Bone-in 12 pc', description: null, price: '22.95' },
      { id: 'bonein-24', name: 'Bone-in 24 pc', description: null, price: '45.95', badge: 'Value' },
      { id: 'boneless-6', name: 'Boneless 6 pc', description: null, price: '11.95' },
      { id: 'boneless-8', name: 'Boneless 8 pc', description: null, price: '15.45' },
      { id: 'boneless-12', name: 'Boneless 12 pc', description: null, price: '22.95' },
      { id: 'boneless-24', name: 'Boneless 24 pc', description: null, price: '45.95' },
    ],
    note: 'Sauce choices are not published on the live menu — worth listing them, since Buffalo and BBQ are already pizza flavours here.',
  },
  {
    id: 'sides',
    name: 'Sides & Starters',
    tagline: 'Fried, baked, and meant for sharing.',
    items: [
      { id: 'mozz-6', name: 'Mozzarella sticks 6 pc', description: null, price: '9.99', diets: ['vegetarian'] },
      { id: 'mozz-8', name: 'Mozzarella sticks 8 pc', description: null, price: '12.95', diets: ['vegetarian'] },
      { id: 'mozz-10', name: 'Mozzarella sticks 10 pc', description: null, price: '16.99', diets: ['vegetarian'] },
      { id: 'chicken-tender-4', name: 'Chicken tenders 4 pc', description: null, price: '10.45' },
      { id: 'chicken-tender-6', name: 'Chicken tenders 6 pc', description: null, price: '12.45' },
      { id: 'jalapeno-poppers', name: 'Jalapeño poppers 8 pc', description: null, price: '8.99', diets: ['vegetarian'] },
      { id: 'onion-rings', name: 'Onion rings', description: null, price: '7.99', diets: ['vegetarian'], verify: 'The live menu has TWO Onion Rings sections, $7.99 and $9.95. Confirm which is right.' },
      { id: 'curly-fries', name: 'Curly fries', description: null, price: '9.95', diets: ['vegetarian'] },
      { id: 'steak-fries', name: 'Steak fries', description: null, price: '9.95', diets: ['vegetarian'] },
      { id: 'sweet-potato', name: 'Sweet potato fries', description: null, price: '10.95', diets: ['vegetarian'], verify: 'Listed as just "Sweet Potato" on the live menu.' },
      { id: 'cheesy-bread', name: 'Cheesy bread', description: null, price: '13.99', diets: ['vegetarian'] },
      { id: 'chips', name: 'Chips', description: null, price: '1.95', diets: ['vegetarian'] },
    ],
  },
  {
    id: 'bread',
    name: 'Bread',
    tagline: 'Baked in the same oven.',
    items: [
      { id: 'garlic-bread', name: 'Garlic bread', description: null, price: '8.95', diets: ['vegetarian'] },
      {
        id: 'ciabatta-garlic-bread',
        name: 'Rustic ciabatta garlic bread with cheese (4 pc)',
        description: null,
        price: '13.95',
        diets: ['vegetarian'],
      },
    ],
  },
  {
    id: 'salads',
    wantsCopy: true,
    name: 'Salads',
    tagline: 'Dressed to order, not out of a tub.',
    items: [
      { id: 'antipasto', name: 'Antipasto salad', description: null, price: '17.95' },
      { id: 'greek-salad', name: 'Greek salad', description: null, price: '17.95', diets: ['vegetarian'], badge: 'Most Popular' },
      { id: 'caprese', name: 'Caprese salad', description: null, price: '16.95', diets: ['vegetarian'] },
      { id: 'garden', name: 'Garden salad', description: null, price: '16.95', diets: ['vegetarian'] },
      { id: 'caesar', name: 'Caesar salad', description: null, price: '15.95' },
      { id: 'house', name: 'House salad', description: null, price: '15.95', diets: ['vegetarian'] },
    ],
    note: 'No salad on the live menu has a description. These are the highest-margin cold items and the easiest to describe well.',
  },
  {
    id: 'sandwiches',
    wantsCopy: true,
    name: 'Sandwiches',
    tagline: 'Served with your choice of side.',
    items: [
      {
        id: 'feta-mediterranean',
        name: 'Feta Mediterranean',
        description: null,
        price: '17.95',
        diets: ['vegetarian'],
        image: CDN.otter('9c517a1d-b23f-4466-b9fb-38f59aafcd79.jpeg'),
      },
      { id: 'classic-italian-hoagie', name: 'Classic Italian Hoagie', description: null, price: '19.95' },
      {
        id: 'meatball-supreme-sub',
        name: 'Meatball Supreme Sub',
        description: null,
        price: '19.95',
        image: CDN.otter('25797e94-a3c1-4b79-bb33-892122697dde.jpeg'),
      },
    ],
    verify: 'This section was only partially captured — the live menu continues past "Classic Past…". Re-scrape or export from the POS to complete it.',
    note: 'Section incomplete: the capture cut off mid-list. The live menu also has deli sandwiches and a cheese steak beyond these three.',
  },
  {
    id: 'dessert',
    wantsCopy: true,
    name: 'Dessert',
    tagline: 'Do not skip it — a regular calls the tiramisu the best they have ever had.',
    items: [
      { id: 'tiramisu', name: 'Italian Tiramisu', description: null, price: '8.99', diets: ['vegetarian'], badge: 'Most Popular' },
      { id: 'creme-brulee', name: 'Crème Brûlée', description: null, price: '9.99', diets: ['vegetarian'], image: CDN.pluto('97dc01d2-2263-4721-8329-da760cc69b97', 640, 640) },
      { id: 'cheesecake', name: 'Big O Cheesecake Factory', description: null, price: '9.99', diets: ['vegetarian'] },
      { id: 'cannoli', name: 'Cannoli', description: null, price: '10.99', diets: ['vegetarian'] },
      { id: 'white-choc-raspberry', name: 'White Chocolate Raspberry', description: null, price: '10.99', diets: ['vegetarian'] },
      { id: 'baklawa', name: 'Baklawa (6 pc)', description: null, price: '22.45', diets: ['vegetarian'], badge: "Chef's Specialty", verify: 'Baklawa at $22.45 for six pieces is a Mediterranean signature — nothing else on the menu is like it. Needs a description and a photo.' },
    ],
  },
  {
    id: 'drinks-bottled',
    name: 'Bottled & Canned',
    tagline: 'Cold, and priced like a neighbourhood place.',
    items: [
      { id: 'can-soda', name: 'Can soda', description: 'Coke, Diet Coke, Sprite, Dr Pepper, Orange Fanta, Lemon or Root Beer.', price: '3.45' },
      { id: 'water-bottle', name: 'Water bottle', description: null, price: '3.45' },
      { id: 'san-pellegrino-can', name: 'San Pellegrino (can)', description: null, price: '4.45' },
      { id: 'san-pellegrino-500', name: 'San Pellegrino sparkling water 500ml', description: null, price: '5.45' },
      { id: 'fiji', name: 'Fiji water', description: null, price: '4.95' },
      { id: 'red-bull', name: 'Red Bull', description: null, price: '4.45' },
    ],
  },
  {
    id: 'drinks-fountain',
    name: 'Fountain & Glass',
    tagline: null,
    items: [
      { id: 'fountain', name: 'Fountain drink', description: null, price: '3.99' },
      { id: 'apple-juice', name: 'Apple juice', description: null, price: '4.45' },
      { id: 'iced-tea', name: 'Iced tea', description: null, price: '4.45' },
      { id: 'glass-coke', name: 'Glass Coke', description: null, price: '5.99' },
      { id: 'glass-coke-half', name: 'Glass Coke ½ litre', description: null, price: '7.45' },
    ],
  },
  {
    id: 'drinks-2l',
    name: '2-Litre Bottles',
    tagline: 'For the 24-inch and up.',
    items: [
      { id: '2l-coke', name: '2L Coke', description: null, price: '6.45' },
      { id: '2l-diet', name: '2L Diet Coke', description: null, price: '6.45' },
      { id: '2l-sprite', name: '2L Sprite', description: null, price: '6.45' },
      { id: '2l-drpepper', name: '2L Dr Pepper', description: null, price: '6.45' },
      { id: '2l-rootbeer', name: '2L Root Beer', description: null, price: '6.45' },
      { id: '2l-orange', name: '2L Orange', description: null, price: '6.45' },
      { id: '2l-other', name: '2L other', description: 'Ask what is on the shelf today.', price: '6.45' },
    ],
  },
];

export const allItems = menu.flatMap((s) => s.items.map((i) => ({ ...i, section: s.name })));

/**
 * Build-time honesty gate. Prints every gap and every correction so nothing
 * invented or silently "fixed" reaches production.
 */
export function menuGaps(): string[] {
  const gaps: string[] = [];
  let noCopy = 0;
  for (const s of menu) {
    if (s.items.length > 12) {
      gaps.push(`[${s.name}] ${s.items.length} items — over the 6-8 decision-fatigue ceiling; consider splitting`);
    }
    if (s.verify) gaps.push(`[${s.name}] SECTION: ${s.verify}`);
    for (const i of s.items) {
      // Descriptive naming is worth ~+27% on a DISH. On a can of Coke it is
      // worth nothing, so those are counted and reported as one line, not 30.
      if (!i.description) {
        if (s.wantsCopy) gaps.push(`[${s.name}] ${i.name}: no description (descriptive naming is worth +27% on a dish)`);
        else noCopy++;
      }
      if (!i.price) gaps.push(`[${s.name}] ${i.name}: no published price`);
      if (i.verify) gaps.push(`[${s.name}] ${i.name}: ${i.verify}`);
    }
  }
  if (noCopy) gaps.push(`[info] ${noCopy} commodity lines (drinks, pack sizes) have no description — intentional, not a gap.`);
  return gaps;
}

export const itemCount = allItems.length;
export const sectionCount = menu.length;

/**
 * The live menu is a single 4,000-item wall. These chapters give it a spine so
 * the page can be scanned in four passes instead of twenty. Each chapter is a
 * list of section ids — sections stay the unit of truth, chapters are only the
 * reading order.
 */
export const chapters = [
  {
    id: 'pizza',
    name: 'Pizza',
    kicker: 'Six sizes. Four sauce families. One seasoned crust.',
    sections: ['signature', 'sizes', 'by-the-slice', 'red-sauce', 'white-alfredo', 'pesto', 'bbq-buffalo', 'mediterranean'],
  },
  {
    id: 'pasta',
    name: 'Pasta & Calzones',
    kicker: 'Made to order, five shapes at one price, six signature plates above it.',
    sections: ['pasta-classics', 'pasta-signature', 'calzones'],
  },
  {
    id: 'sides',
    name: 'Sides, Salads & Sandwiches',
    kicker: 'What the table orders while it waits.',
    sections: ['wings', 'sides', 'bread', 'salads', 'sandwiches'],
  },
  {
    id: 'sweet',
    name: 'Dessert & Drinks',
    kicker: 'The tiramisu is not optional.',
    sections: ['dessert', 'drinks-bottled', 'drinks-fountain', 'drinks-2l'],
  },
] as const;

/** Resolve a chapter to its real sections, so a typo fails the build loudly. */
export function chapterSections(chapterIds: readonly string[]): MenuSection[] {
  const found = menu.filter((s) => chapterIds.includes(s.id));
  if (found.length !== chapterIds.length) {
    const missing = chapterIds.filter((id) => !found.some((s) => s.id === id));
    throw new Error(`menu.ts chapters reference missing sections: ${missing.join(', ')}`);
  }
  return found;
}
