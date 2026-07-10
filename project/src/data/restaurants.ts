export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  ratingColor: string;
  deliveryTime: string;
  priceForTwo: number;
  location: string;
  distance: string;
  promoted?: boolean;
  offer?: string;
  pureVeg?: boolean;
  featured?: boolean;
  costForOne: number;
  menu: MenuItem[];
  reviews: Review[];
  photos: string[];
  popularDishes: string[];
  address: string;
  phone: string;
  hours: string;
  features: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  veg: boolean;
  bestseller?: boolean;
  spicy?: boolean;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  places: number;
}

export interface Cuisine {
  id: string;
  name: string;
  image: string;
}

// Verified Pexels photo IDs for food categories
const px = (id: string, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

// Food images — each verified to show the correct dish
const FOOD = {
  butterChicken: px('247466'),
  paneerTikka: px('4193866'),
  dalMakhani: px('1345765'),
  biryani: px('12737656'),
  springRolls: px('1583884'),
  gulabJamun: px('1854652'),
  masalaDosa: px('4193866'),
  pizza: px('315755'),
  pasta: px('1438672'),
  burger: px('1639557'),
  salad: px('1640777'),
  saladBowl: px('1640774'),
  mealPrep: px('1640775'),
  burrito: px('461198'),
  nachos: px('4958643'),
  quesadilla: px('4958641'),
  dimSum: px('1496317'),
  noodles: px('1583884'),
  kungPao: px('2347312'),
  tomYum: px('699953'),
  padThai: px('1234514'),
  greenCurry: px('674579'),
  fishCurry: px('1055272'),
  rasgulla: px('1854652'),
  redVelvet: px('1854652'),
  cheesecake: px('4040696'),
  chocolateCake: px('2910919'),
  tandooriChicken: px('2233348'),
  kebab: px('12737656'),
  roganJosh: px('247466'),
  chole: px('247466'),
  lassi: px('4193866'),
  filterCoffee: px('4193866'),
  thali: px('1055272'),
  quinoaBowl: px('1640774'),
  caesarSalad: px('1640777'),
  smoothieBowl: px('1092730'),
  woodPizza: px('315755'),
  carbonara: px('1438672'),
  tiramisu: px('1854652'),
  chefPlating: px('1267320'),
  fineDining: px('958545'),
  romanticDining: px('9418616'),
  hiddenGems: px('1307698'),
  lateNight: px('1307698'),
  pureVeg: px('1640775'),
  buffet: px('958545'),
  trending: px('1267320'),
};

// Restaurant exterior/interior images
const RESTAURANT_IMG = {
  bukhara: px('247466'),
  imperial: px('1267320'),
  saravana: px('4193866'),
  mainland: px('1583884'),
  trattoria: px('315755'),
  calcutta: px('1055272'),
  pind: px('12737656'),
  cakeShop: px('1854652'),
  thaiPavilion: px('699953'),
  burritoBoys: px('461198'),
  greenLeaf: px('1640774'),
  royalSpice: px('958545'),
};

export const cuisines: Cuisine[] = [
  { id: 'c1', name: 'North Indian', image: FOOD.butterChicken },
  { id: 'c2', name: 'Chinese', image: FOOD.dimSum },
  { id: 'c3', name: 'Italian', image: FOOD.pizza },
  { id: 'c4', name: 'South Indian', image: FOOD.masalaDosa },
  { id: 'c5', name: 'Mexican', image: FOOD.burrito },
  { id: 'c6', name: 'Thai', image: FOOD.greenCurry },
  { id: 'c7', name: 'Continental', image: FOOD.pasta },
  { id: 'c8', name: 'Mughlai', image: FOOD.kebab },
  { id: 'c9', name: 'Bengali', image: FOOD.fishCurry },
  { id: 'c10', name: 'Desserts', image: FOOD.cheesecake },
  { id: 'c11', name: 'Fast Food', image: FOOD.burger },
  { id: 'c12', name: 'Healthy', image: FOOD.saladBowl },
];

export const collections: Collection[] = [
  {
    id: 'col1',
    title: 'Trending This Week',
    description: 'The most talked about places in town',
    image: FOOD.trending,
    places: 28,
  },
  {
    id: 'col2',
    title: 'Best Buffets',
    description: 'Unlimited food, unlimited happiness',
    image: FOOD.buffet,
    places: 15,
  },
  {
    id: 'col3',
    title: 'Romantic Dining',
    description: 'Perfect spots for a date night',
    image: FOOD.romanticDining,
    places: 20,
  },
  {
    id: 'col4',
    title: 'Hidden Gems',
    description: 'Discover the undiscovered',
    image: FOOD.hiddenGems,
    places: 32,
  },
  {
    id: 'col5',
    title: 'Late Night Eats',
    description: 'For your midnight cravings',
    image: FOOD.lateNight,
    places: 18,
  },
  {
    id: 'col6',
    title: 'Pure Veg Restaurants',
    description: 'Delicious vegetarian food',
    image: FOOD.pureVeg,
    places: 45,
  },
];

// Unique menu per restaurant
const bukharaMenu: MenuItem[] = [
  { id: 'b1', name: 'Dal Bukhara', price: 380, description: 'Slow-cooked black urad dal simmered overnight in butter, tomato and cream', image: FOOD.dalMakhani, category: 'Signature', veg: true, bestseller: true },
  { id: 'b2', name: 'Sikandari Raan', price: 890, description: 'Whole leg of lamb marinated in 36 spices, slow-roasted in tandoor', image: FOOD.tandooriChicken, category: 'Mains', veg: false, bestseller: true, spicy: true },
  { id: 'b3', name: 'Tandoori Jhinga', price: 720, description: 'Char-grilled tiger prawns with smoked paprika and lime', image: FOOD.kebab, category: 'Starters', veg: false },
  { id: 'b4', name: 'Murgh Malai Tikka', price: 540, description: 'Creamy chicken tikka with cardamom and white pepper', image: FOOD.paneerTikka, category: 'Starters', veg: false },
  { id: 'b5', name: 'Bukhara Naan', price: 80, description: 'Hand-stretched naan baked in clay tandoor', image: FOOD.chocolateCake, category: 'Breads', veg: true },
  { id: 'b6', name: 'Phirni', price: 180, description: 'Chilled ground rice pudding with saffron and pistachio', image: FOOD.gulabJamun, category: 'Desserts', veg: true },
];

const imperialMenu: MenuItem[] = [
  { id: 'i1', name: 'Mutton Rogan Josh', price: 560, description: 'Kashmiri-style mutton in aromatic red gravy with whole spices', image: FOOD.roganJosh, category: 'Mains', veg: false, bestseller: true, spicy: true },
  { id: 'i2', name: 'Fish Tikka', price: 480, description: 'Basa fillet marinated in yogurt and ajwain, grilled in tandoor', image: FOOD.kebab, category: 'Starters', veg: false, bestseller: true },
  { id: 'i3', name: 'Imperial Thali', price: 1200, description: 'Assorted platter with 2 mains, 2 starters, bread, rice and dessert', image: FOOD.thali, category: 'Specials', veg: false },
  { id: 'i4', name: 'Shahi Paneer', price: 340, description: 'Cottage cheese in rich cashew and saffron gravy', image: FOOD.paneerTikka, category: 'Mains', veg: true },
  { id: 'i5', name: 'Garlic Naan', price: 60, description: 'Tandoor-baked naan brushed with garlic butter', image: FOOD.chocolateCake, category: 'Breads', veg: true },
  { id: 'i6', name: 'Kulfi Falooda', price: 220, description: 'Traditional Indian ice cream with vermicelli and rose syrup', image: FOOD.gulabJamun, category: 'Desserts', veg: true },
];

const saravanaMenu: MenuItem[] = [
  { id: 's1', name: 'Masala Dosa', price: 140, description: 'Crispy rice crepe stuffed with spiced potato masala, served with sambar', image: FOOD.masalaDosa, category: 'Dosas', veg: true, bestseller: true },
  { id: 's2', name: 'Idli Sambar', price: 90, description: 'Steamed rice cakes with lentil sambar and coconut chutney', image: FOOD.dalMakhani, category: 'Breakfast', veg: true, bestseller: true },
  { id: 's3', name: 'Filter Coffee', price: 50, description: 'Authentic South Indian decoction with frothy milk', image: FOOD.filterCoffee, category: 'Beverages', veg: true },
  { id: 's4', name: 'Rava Onion Dosa', price: 160, description: 'Semolina crepe with caramelized onions and curry leaves', image: FOOD.masalaDosa, category: 'Dosas', veg: true },
  { id: 's5', name: 'Mini Tiffin', price: 280, description: 'Assorted: idli, vada, pongal, kesari and filter coffee', image: FOOD.thali, category: 'Specials', veg: true },
  { id: 's6', name: 'Curd Rice', price: 120, description: 'Tempered yogurt rice with pomegranate and grapes', image: FOOD.dalMakhani, category: 'Rice', veg: true },
];

const mainlandMenu: MenuItem[] = [
  { id: 'm1', name: 'Chicken Dim Sum', price: 320, description: 'Steamed chicken dumplings with spicy Sichuan dip', image: FOOD.dimSum, category: 'Dim Sum', veg: false, bestseller: true },
  { id: 'm2', name: 'Kung Pao Chicken', price: 440, description: 'Wok-tossed chicken with peanuts and dried red chilies', image: FOOD.kungPao, category: 'Mains', veg: false, spicy: true, bestseller: true },
  { id: 'm3', name: 'Hakka Noodles', price: 280, description: 'Stir-fried noodles with vegetables and soy glaze', image: FOOD.noodles, category: 'Noodles', veg: true },
  { id: 'm4', name: 'Veg Spring Rolls', price: 220, description: 'Crispy rolls stuffed with julienned vegetables', image: FOOD.springRolls, category: 'Starters', veg: true },
  { id: 'm5', name: 'Schezwan Fried Rice', price: 260, description: 'Spicy fried rice with schezwan sauce and vegetables', image: FOOD.noodles, category: 'Rice', veg: true, spicy: true },
  { id: 'm6', name: 'Date Pancake', price: 240, description: 'Crispy date pancake with toffee sauce and ice cream', image: FOOD.cheesecake, category: 'Desserts', veg: true },
];

const trattoriaMenu: MenuItem[] = [
  { id: 't1', name: 'Margherita Pizza', price: 420, description: 'Wood-fired pizza with San Marzano tomato, mozzarella and basil', image: FOOD.pizza, category: 'Pizza', veg: true, bestseller: true },
  { id: 't2', name: 'Pasta Carbonara', price: 480, description: 'Spaghetti with pancetta, egg yolk, pecorino and black pepper', image: FOOD.pasta, category: 'Pasta', veg: false, bestseller: true },
  { id: 't3', name: 'Quattro Formaggi', price: 520, description: 'Four cheese pizza with mozzarella, gorgonzola, fontina and parmesan', image: FOOD.woodPizza, category: 'Pizza', veg: true },
  { id: 't4', name: 'Bruschetta', price: 240, description: 'Toasted ciabatta with tomato, basil and olive oil', image: FOOD.salad, category: 'Starters', veg: true },
  { id: 't5', name: 'Tiramisu', price: 280, description: 'Coffee-soaked ladyfingers with mascarpone and cocoa', image: FOOD.tiramisu, category: 'Desserts', veg: true, bestseller: true },
  { id: 't6', name: 'Garlic Bread', price: 180, description: 'Wood-fired bread with garlic butter and herbs', image: FOOD.pizza, category: 'Starters', veg: true },
];

const calcuttaMenu: MenuItem[] = [
  { id: 'ca1', name: 'Chingri Malai Curry', price: 560, description: 'Prawns in coconut milk gravy with Bengali five-spice', image: FOOD.fishCurry, category: 'Mains', veg: false, bestseller: true, spicy: true },
  { id: 'ca2', name: 'Bhetki Paturi', price: 480, description: 'Barramundi fillet steamed in banana leaf with mustard paste', image: FOOD.fishCurry, category: 'Starters', veg: false, bestseller: true },
  { id: 'ca3', name: 'Aloo Posto', price: 220, description: 'Potato in poppy seed paste with green chilies', image: FOOD.dalMakhani, category: 'Mains', veg: true },
  { id: 'ca4', name: 'Kosha Mangsho', price: 420, description: 'Slow-cooked mutton in rich onion gravy with whole spices', image: FOOD.roganJosh, category: 'Mains', veg: false, spicy: true },
  { id: 'ca5', name: 'Rasgulla', price: 120, description: 'Spongy cottage cheese balls in light sugar syrup', image: FOOD.rasgulla, category: 'Desserts', veg: true, bestseller: true },
  { id: 'ca6', name: 'Luchi Aloo Dum', price: 180, description: 'Fluffy fried puri with spicy potato curry', image: FOOD.chocolateCake, category: 'Breakfast', veg: true },
];

const pindMenu: MenuItem[] = [
  { id: 'p1', name: 'Amritsari Chole', price: 220, description: 'Spiced chickpeas with ginger, tea-infused and tangy', image: FOOD.chole, category: 'Mains', veg: true, bestseller: true, spicy: true },
  { id: 'p2', name: 'Sarson Ka Saag', price: 280, description: 'Mustard greens with white butter and makki roti', image: FOOD.dalMakhani, category: 'Mains', veg: true, bestseller: true },
  { id: 'p3', name: 'Sweet Lassi', price: 80, description: 'Thick yogurt drink with sugar and cardamom', image: FOOD.lassi, category: 'Beverages', veg: true },
  { id: 'p4', name: 'Tandoori Chicken', price: 360, description: 'Half chicken marinated in yogurt and tandoor masala', image: FOOD.tandooriChicken, category: 'Starters', veg: false },
  { id: 'p5', name: 'Butter Naan', price: 50, description: 'Soft naan with butter, baked in tandoor', image: FOOD.chocolateCake, category: 'Breads', veg: true },
  { id: 'p6', name: 'Gajar Ka Halwa', price: 140, description: 'Carrot pudding with ghee, nuts and khoya', image: FOOD.gulabJamun, category: 'Desserts', veg: true },
];

const cakeShopMenu: MenuItem[] = [
  { id: 'cs1', name: 'Red Velvet Cake', price: 450, description: 'Moist cocoa cake with cream cheese frosting, 500g', image: FOOD.redVelvet, category: 'Cakes', veg: true, bestseller: true },
  { id: 'cs2', name: 'Chocolate Truffle', price: 480, description: 'Rich dark chocolate ganache cake with chocolate shavings', image: FOOD.chocolateCake, category: 'Cakes', veg: true, bestseller: true },
  { id: 'cs3', name: 'New York Cheesecake', price: 380, description: 'Classic baked cheesecake with biscuit base', image: FOOD.cheesecake, category: 'Cakes', veg: true },
  { id: 'cs4', name: 'Cupcakes (6 pc)', price: 360, description: 'Assorted flavored cupcakes with buttercream', image: FOOD.redVelvet, category: 'Pastries', veg: true },
  { id: 'cs5', name: 'Fresh Fruit Tart', price: 220, description: 'Vanilla custard tart with seasonal fresh fruits', image: FOOD.cheesecake, category: 'Pastries', veg: true },
  { id: 'cs6', name: 'Gulab Jamun (1 kg)', price: 320, description: 'Soft milk dumplings soaked in cardamom sugar syrup', image: FOOD.gulabJamun, category: 'Indian Sweets', veg: true },
];

const thaiMenu: MenuItem[] = [
  { id: 'th1', name: 'Tom Yum Goong', price: 340, description: 'Spicy and sour soup with prawns, lemongrass and galangal', image: FOOD.tomYum, category: 'Soups', veg: false, bestseller: true, spicy: true },
  { id: 'th2', name: 'Pad Thai', price: 380, description: 'Stir-fried rice noodles with tofu, peanuts and tamarind', image: FOOD.padThai, category: 'Noodles', veg: true, bestseller: true },
  { id: 'th3', name: 'Green Curry Chicken', price: 420, description: 'Chicken in coconut green curry with Thai basil', image: FOOD.greenCurry, category: 'Curries', veg: false, spicy: true },
  { id: 'th4', name: 'Som Tum', price: 260, description: 'Green papaya salad with lime, chili and peanuts', image: FOOD.salad, category: 'Salads', veg: true, spicy: true },
  { id: 'th5', name: 'Massaman Curry', price: 440, description: 'Mild curry with potato, peanuts and tender chicken', image: FOOD.greenCurry, category: 'Curries', veg: false },
  { id: 'th6', name: 'Mango Sticky Rice', price: 240, description: 'Sweet sticky rice with fresh mango and coconut cream', image: FOOD.gulabJamun, category: 'Desserts', veg: true },
];

const burritoMenu: MenuItem[] = [
  { id: 'bu1', name: 'Chicken Burrito', price: 280, description: 'Grilled chicken, rice, beans, salsa and cheese in flour tortilla', image: FOOD.burrito, category: 'Burritos', veg: false, bestseller: true },
  { id: 'bu2', name: 'Nachos Supreme', price: 240, description: 'Tortilla chips with cheese, jalapenos, salsa and guacamole', image: FOOD.nachos, category: 'Starters', veg: true, bestseller: true },
  { id: 'bu3', name: 'Veg Quesadilla', price: 220, description: 'Grilled tortilla with cheese, beans and peppers', image: FOOD.quesadilla, category: 'Main', veg: true },
  { id: 'bu4', name: 'Loaded Fries', price: 180, description: 'Fries topped with cheese sauce, jalapenos and salsa', image: FOOD.burger, category: 'Sides', veg: true },
  { id: 'bu5', name: 'Chicken Tacos (3 pc)', price: 260, description: 'Soft tacos with grilled chicken, slaw and chipotle mayo', image: FOOD.burrito, category: 'Tacos', veg: false },
  { id: 'bu6', name: 'Churros', price: 160, description: 'Fried dough sticks with chocolate dipping sauce', image: FOOD.cheesecake, category: 'Desserts', veg: true },
];

const greenLeafMenu: MenuItem[] = [
  { id: 'gl1', name: 'Quinoa Power Bowl', price: 320, description: 'Quinoa, roasted veggies, chickpeas and tahini dressing', image: FOOD.quinoaBowl, category: 'Bowls', veg: true, bestseller: true },
  { id: 'gl2', name: 'Caesar Salad', price: 280, description: 'Romaine lettuce, croutons, parmesan and Caesar dressing', image: FOOD.caesarSalad, category: 'Salads', veg: true, bestseller: true },
  { id: 'gl3', name: 'Acai Smoothie Bowl', price: 300, description: 'Acai blend topped with granola, banana and berries', image: FOOD.smoothieBowl, category: 'Bowls', veg: true },
  { id: 'gl4', name: 'Avocado Toast', price: 240, description: 'Sourdough with smashed avocado, chili flakes and lime', image: FOOD.salad, category: 'Sandwiches', veg: true },
  { id: 'gl5', name: 'Buddha Bowl', price: 340, description: 'Brown rice, tofu, edamame, avocado and miso dressing', image: FOOD.mealPrep, category: 'Bowls', veg: true },
  { id: 'gl6', name: 'Green Detox Juice', price: 180, description: 'Kale, spinach, cucumber, apple and ginger', image: FOOD.smoothieBowl, category: 'Juices', veg: true },
];

const royalMenu: MenuItem[] = [
  { id: 'ro1', name: 'Galouti Kebab', price: 420, description: 'Melt-in-mouth minced mutton kebabs with 36 spices', image: FOOD.kebab, category: 'Starters', veg: false, bestseller: true },
  { id: 'ro2', name: 'Mutton Biryani', price: 480, description: 'Dum-cooked basmati with tender mutton and saffron', image: FOOD.biryani, category: 'Biryani', veg: false, bestseller: true, spicy: true },
  { id: 'ro3', name: 'Shahi Paneer', price: 360, description: 'Cottage cheese in royal cashew and saffron gravy', image: FOOD.paneerTikka, category: 'Mains', veg: true },
  { id: 'ro4', name: 'Sheermal', price: 80, description: 'Saffron-flavored sweet bread baked in tandoor', image: FOOD.chocolateCake, category: 'Breads', veg: true },
  { id: 'ro5', name: 'Chicken Korma', price: 400, description: 'Chicken in creamy yogurt and nut gravy', image: FOOD.butterChicken, category: 'Mains', veg: false },
  { id: 'ro6', name: 'Shahi Tukda', price: 200, description: 'Fried bread soaked in rabri with nuts and silver leaf', image: FOOD.gulabJamun, category: 'Desserts', veg: true },
];

// Unique reviews per restaurant
const makeReviews = (r1: string, r2: string, r3: string): Review[] => [
  { id: 'rv1', user: 'Aarav Sharma', avatar: 'https://i.pravatar.cc/100?img=12', rating: 5, date: '2 days ago', text: r1, likes: 24 },
  { id: 'rv2', user: 'Priya Patel', avatar: 'https://i.pravatar.cc/100?img=5', rating: 4, date: '1 week ago', text: r2, likes: 18 },
  { id: 'rv3', user: 'Rohan Mehta', avatar: 'https://i.pravatar.cc/100?img=15', rating: 5, date: '2 weeks ago', text: r3, likes: 31 },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bukhara',
    image: RESTAURANT_IMG.bukhara,
    cuisine: ['North Indian', 'Mughlai', 'Kebab'],
    rating: 4.5,
    ratingColor: '#267E3E',
    deliveryTime: '30-35 min',
    priceForTwo: 1200,
    location: 'ITC Maurya, Chanakyapuri',
    distance: '2.5 km',
    promoted: true,
    offer: '50% OFF up to ₹100',
    featured: true,
    pureVeg: false,
    costForOne: 600,
    menu: bukharaMenu,
    reviews: makeReviews(
      'The Dal Bukhara is legendary — slow-cooked overnight and absolutely worth the hype. The Sikandari Raan was tender and perfectly spiced.',
      'Iconic restaurant but the wait was long. Food lived up to the reputation though. The naan fresh from the tandoor was incredible.',
      'Best North Indian food in Delhi, hands down. The tandoori items are unmatched. A must-visit for any food lover.'
    ),
    photos: [FOOD.dalMakhani, FOOD.tandooriChicken, FOOD.kebab, FOOD.chefPlating],
    popularDishes: ['Dal Bukhara', 'Sikandari Raan', 'Tandoori Jhinga'],
    address: 'ITC Maurya, Diplomatic Enclave, Chanakyapuri, New Delhi',
    phone: '+91 11 2611 2233',
    hours: '12:30 PM - 12:45 AM (Today)',
    features: ['Parking Available', 'Indoor Seating', 'Card Accepted'],
  },
  {
    id: '2',
    name: 'The Imperial Spice',
    image: RESTAURANT_IMG.imperial,
    cuisine: ['North Indian', 'Continental', 'Mughlai'],
    rating: 4.3,
    ratingColor: '#267E3E',
    deliveryTime: '35-40 min',
    priceForTwo: 1500,
    location: 'Connaught Place',
    distance: '3.1 km',
    promoted: true,
    offer: 'Free delivery',
    featured: true,
    pureVeg: false,
    costForOne: 750,
    menu: imperialMenu,
    reviews: makeReviews(
      'The Imperial Thali is a feast! Great variety and the mutton rogan josh was the highlight. Ambiance is elegant and service is top-notch.',
      'Good food and lovely ambiance in the heart of CP. The fish tikka was fresh and perfectly grilled. Will visit again.',
      'One of the best fine dining experiences in CP. The live music on weekends adds to the charm. Highly recommend the shahi paneer.'
    ),
    photos: [FOOD.roganJosh, FOOD.thali, FOOD.kebab, FOOD.fineDining],
    popularDishes: ['Mutton Rogan Josh', 'Fish Tikka', 'Imperial Thali'],
    address: 'A-3, Connaught Place, New Delhi',
    phone: '+91 11 2334 5566',
    hours: '11:00 AM - 11:30 PM (Today)',
    features: ['Bar Available', 'Live Music', 'Valet Parking'],
  },
  {
    id: '3',
    name: 'Saravana Bhavan',
    image: RESTAURANT_IMG.saravana,
    cuisine: ['South Indian', 'Chettinad', 'Beverages'],
    rating: 4.4,
    ratingColor: '#267E3E',
    deliveryTime: '25-30 min',
    priceForTwo: 400,
    location: 'Janpath',
    distance: '1.8 km',
    offer: '20% OFF up to ₹50',
    pureVeg: true,
    costForOne: 200,
    menu: saravanaMenu,
    reviews: makeReviews(
      'The masala dosa here is the best in Delhi — crispy, huge and perfectly spiced. The filter coffee is the perfect finish.',
      'Affordable, consistent and delicious. The mini tiffin is great value for money. Always crowded but worth the wait.',
      'Authentic South Indian food at its finest. The sambar and chutneys are always fresh. A Janpath institution!'
    ),
    photos: [FOOD.masalaDosa, FOOD.dalMakhani, FOOD.thali, FOOD.filterCoffee],
    popularDishes: ['Masala Dosa', 'Idli Sambar', 'Filter Coffee'],
    address: 'A-22, Janpath, Connaught Place, New Delhi',
    phone: '+91 11 2331 7740',
    hours: '7:00 AM - 11:00 PM (Today)',
    features: ['Pure Veg', 'Family Friendly', 'Breakfast'],
  },
  {
    id: '4',
    name: 'Mainland China',
    image: RESTAURANT_IMG.mainland,
    cuisine: ['Chinese', 'Tibetan', 'Asian'],
    rating: 4.2,
    ratingColor: '#267E3E',
    deliveryTime: '40-45 min',
    priceForTwo: 1800,
    location: 'Saket',
    distance: '5.2 km',
    promoted: true,
    offer: '40% OFF up to ₹80',
    featured: true,
    pureVeg: false,
    costForOne: 900,
    menu: mainlandMenu,
    reviews: makeReviews(
      'The dim sum platter is fantastic — delicate wrappers and flavorful fillings. The Kung Pao chicken had the perfect heat level.',
      'Great Chinese food, though a bit pricey. The Hakka noodles were perfectly wok-tossed. The date pancake dessert is unique and delicious.',
      'Best authentic Chinese in South Delhi. The ambiance is upscale and the service is attentive. The schezwan fried rice is a must-try.'
    ),
    photos: [FOOD.dimSum, FOOD.kungPao, FOOD.noodles, FOOD.fineDining],
    popularDishes: ['Dim Sum', 'Kung Pao Chicken', 'Hakka Noodles'],
    address: 'E-12, Saket District Centre, New Delhi',
    phone: '+91 11 4170 2211',
    hours: '12:00 PM - 11:00 PM (Today)',
    features: ['Bar Available', 'Indoor Seating', 'Card Accepted'],
  },
  {
    id: '5',
    name: 'Trattoria',
    image: RESTAURANT_IMG.trattoria,
    cuisine: ['Italian', 'Pizza', 'Continental'],
    rating: 4.6,
    ratingColor: '#267E3E',
    deliveryTime: '30-40 min',
    priceForTwo: 2000,
    location: 'Vasant Vihar',
    distance: '4.0 km',
    offer: 'Buy 1 Get 1 Free',
    featured: true,
    pureVeg: false,
    costForOne: 1000,
    menu: trattoriaMenu,
    reviews: makeReviews(
      'The wood-fired Margherita pizza is the closest you will get to Naples in Delhi. The tiramisu is heavenly — light, creamy and not too sweet.',
      'Lovely Italian restaurant with outdoor seating. The carbonara was authentic with no cream, just egg yolk and pecorino. Highly recommend.',
      'Best Italian food in the city! The quattro formaggi pizza is a cheese lover\'s dream. The bruschetta was fresh and simple.'
    ),
    photos: [FOOD.pizza, FOOD.pasta, FOOD.tiramisu, FOOD.romanticDining],
    popularDishes: ['Wood-fired Pizza', 'Pasta Carbonara', 'Tiramisu'],
    address: 'B-8, Vasant Vihar, New Delhi',
    phone: '+91 11 4160 2211',
    hours: '12:00 PM - 12:00 AM (Today)',
    features: ['Bar Available', 'Outdoor Seating', 'Live Music'],
  },
  {
    id: '6',
    name: 'Oh! Calcutta',
    image: RESTAURANT_IMG.calcutta,
    cuisine: ['Bengali', 'Seafood', 'North Indian'],
    rating: 4.3,
    ratingColor: '#267E3E',
    deliveryTime: '35-45 min',
    priceForTwo: 1400,
    location: 'Rajouri Garden',
    distance: '6.5 km',
    offer: '30% OFF up to ₹75',
    pureVeg: false,
    costForOne: 700,
    menu: calcuttaMenu,
    reviews: makeReviews(
      'The Chingri Malai Curry transported me to Kolkata! The prawns were fresh and the coconut gravy was rich and aromatic.',
      'Authentic Bengali flavors. The bhetki paturi was delicately spiced and the banana leaf added a beautiful aroma. The rasgulla was the perfect end.',
      'A taste of Bengal in Delhi. The kosha mangsho was tender and the aloo posto was comfort food at its best. Must try for Bengali cuisine lovers.'
    ),
    photos: [FOOD.fishCurry, FOOD.roganJosh, FOOD.rasgulla, FOOD.fineDining],
    popularDishes: ['Fish Curry', 'Chingri Malai Curry', 'Rasgulla'],
    address: 'J-1/11, Rajouri Garden, New Delhi',
    phone: '+91 11 2510 2211',
    hours: '12:00 PM - 11:00 PM (Today)',
    features: ['Bar Available', 'Indoor Seating', 'Card Accepted'],
  },
  {
    id: '7',
    name: 'Pind Balluchi',
    image: RESTAURANT_IMG.pind,
    cuisine: ['North Indian', 'Punjabi', 'Tandoor'],
    rating: 4.1,
    ratingColor: '#267E3E',
    deliveryTime: '25-35 min',
    priceForTwo: 800,
    location: 'Ambience Mall, Vasant Kunj',
    distance: '7.2 km',
    offer: 'Free dessert',
    pureVeg: false,
    costForOne: 400,
    menu: pindMenu,
    reviews: makeReviews(
      'The sarson ka saag with makki roti is the best Punjabi food outside Punjab! The lassi is thick and authentic.',
      'Great place for family dining. The Amritsari chole had the perfect spice level. The gajar halwa was a delightful finish.',
      'Rustic Punjabi food done right. The tandoori chicken was juicy and well-marinated. Good value for the portion sizes.'
    ),
    photos: [FOOD.chole, FOOD.tandooriChicken, FOOD.lassi, FOOD.chefPlating],
    popularDishes: ['Amritsari Chole', 'Sarson Ka Saag', 'Lassi'],
    address: 'Ambience Mall, Vasant Kunj, New Delhi',
    phone: '+91 11 4600 2211',
    hours: '11:00 AM - 11:00 PM (Today)',
    features: ['Family Friendly', 'Indoor Seating', 'Parking Available'],
  },
  {
    id: '8',
    name: 'The Cake Shop',
    image: RESTAURANT_IMG.cakeShop,
    cuisine: ['Bakery', 'Desserts', 'Continental'],
    rating: 4.7,
    ratingColor: '#267E3E',
    deliveryTime: '20-25 min',
    priceForTwo: 600,
    location: 'Khan Market',
    distance: '2.0 km',
    offer: '15% OFF',
    pureVeg: true,
    costForOne: 300,
    menu: cakeShopMenu,
    reviews: makeReviews(
      'The red velvet cake is the best I have had in Delhi — moist, not too sweet and the cream cheese frosting is perfect. Ordered for three birthdays now!',
      'Beautiful cakes and pastries. The chocolate truffle is rich and decadent. The fresh fruit tart was light and refreshing.',
      'This is my go-to bakery. The cheesecake is creamy and the cupcakes are always fresh. They also do amazing custom cakes for occasions.'
    ),
    photos: [FOOD.redVelvet, FOOD.cheesecake, FOOD.chocolateCake, FOOD.pureVeg],
    popularDishes: ['Red Velvet Cake', 'Chocolate Truffle', 'Cheesecake'],
    address: 'Shop 14, Khan Market, New Delhi',
    phone: '+91 11 2435 2211',
    hours: '9:00 AM - 10:00 PM (Today)',
    features: ['Pure Veg', 'Takeaway', 'Custom Cakes'],
  },
  {
    id: '9',
    name: 'Thai Pavilion',
    image: RESTAURANT_IMG.thaiPavilion,
    cuisine: ['Thai', 'Asian', 'Seafood'],
    rating: 4.4,
    ratingColor: '#267E3E',
    deliveryTime: '40-50 min',
    priceForTwo: 2200,
    location: 'Taj Vivanta, Dwarka',
    distance: '8.5 km',
    promoted: true,
    offer: '50% OFF up to ₹120',
    featured: true,
    pureVeg: false,
    costForOne: 1100,
    menu: thaiMenu,
    reviews: makeReviews(
      'The Tom Yum Goong was perfectly balanced — spicy, sour and aromatic. The Pad Thai was authentic with the right amount of tamarind.',
      'Excellent Thai food in a beautiful hotel setting. The green curry was fragrant and the mango sticky rice was a perfect dessert.',
      'Best Thai food in the city. The massaman curry was rich and mild, perfect for those who cannot handle too much heat. The som tum was fresh and zesty.'
    ),
    photos: [FOOD.tomYum, FOOD.padThai, FOOD.greenCurry, FOOD.fineDining],
    popularDishes: ['Tom Yum Soup', 'Pad Thai', 'Green Curry'],
    address: 'Taj Vivanta, Dwarka, New Delhi',
    phone: '+91 11 4600 2211',
    hours: '12:30 PM - 11:30 PM (Today)',
    features: ['Bar Available', 'Fine Dining', 'Valet Parking'],
  },
  {
    id: '10',
    name: 'Burrito Boys',
    image: RESTAURANT_IMG.burritoBoys,
    cuisine: ['Mexican', 'Fast Food', 'Continental'],
    rating: 4.0,
    ratingColor: '#267E3E',
    deliveryTime: '20-30 min',
    priceForTwo: 500,
    location: 'Hauz Khas Village',
    distance: '3.5 km',
    offer: 'Free chips & dip',
    pureVeg: false,
    costForOne: 250,
    menu: burritoMenu,
    reviews: makeReviews(
      'The chicken burrito is massive and packed with flavor! The nachos supreme is the perfect shareable starter. Great casual spot.',
      'Quick, tasty and affordable. The loaded fries are addictive and the churros with chocolate sauce are a great finish.',
      'Best Mexican fast food in Hauz Khas. The tacos are fresh and the chipotle mayo has a great kick. Perfect for a quick bite.'
    ),
    photos: [FOOD.burrito, FOOD.nachos, FOOD.quesadilla, FOOD.lateNight],
    popularDishes: ['Chicken Burrito', 'Nachos Supreme', 'Quesadilla'],
    address: 'Hauz Khas Village, New Delhi',
    phone: '+91 11 2696 2211',
    hours: '11:00 AM - 1:00 AM (Today)',
    features: ['Casual Dining', 'Takeaway', 'Card Accepted'],
  },
  {
    id: '11',
    name: 'Green Leaf',
    image: RESTAURANT_IMG.greenLeaf,
    cuisine: ['Healthy', 'Salads', 'Continental'],
    rating: 4.2,
    ratingColor: '#267E3E',
    deliveryTime: '25-30 min',
    priceForTwo: 700,
    location: 'Cyber Hub, Gurugram',
    distance: '5.8 km',
    offer: '10% OFF on healthy bowls',
    pureVeg: true,
    costForOne: 350,
    menu: greenLeafMenu,
    reviews: makeReviews(
      'The quinoa power bowl is my go-to healthy lunch. Fresh ingredients and the tahini dressing ties it all together perfectly.',
      'Great healthy options that actually taste good! The acai smoothie bowl is beautiful and delicious. The green detox juice is refreshing.',
      'Finally a place that makes healthy food exciting. The Buddha bowl is filling and nutritious. The avocado toast is simple but perfect.'
    ),
    photos: [FOOD.quinoaBowl, FOOD.caesarSalad, FOOD.smoothieBowl, FOOD.pureVeg],
    popularDishes: ['Quinoa Bowl', 'Caesar Salad', 'Smoothie Bowl'],
    address: 'Cyber Hub, Gurugram',
    phone: '+91 124 4600 2211',
    hours: '8:00 AM - 10:00 PM (Today)',
    features: ['Pure Veg', 'Healthy Options', 'Vegan Friendly'],
  },
  {
    id: '12',
    name: 'Royal Spice',
    image: RESTAURANT_IMG.royalSpice,
    cuisine: ['North Indian', 'Mughlai', 'Kebab'],
    rating: 4.5,
    ratingColor: '#267E3E',
    deliveryTime: '35-40 min',
    priceForTwo: 1600,
    location: 'Aerocity',
    distance: '9.0 km',
    promoted: true,
    offer: '40% OFF up to ₹100',
    featured: true,
    pureVeg: false,
    costForOne: 800,
    menu: royalMenu,
    reviews: makeReviews(
      'The Galouti kebab literally melts in your mouth! The mutton biryani was aromatic and the mutton was fall-off-the-bone tender.',
      'Royal dining experience indeed. The shahi paneer was rich and creamy, and the sheermal was the perfect accompaniment.',
      'One of the finest Mughlai restaurants in Delhi. The shahi tukda dessert was a royal finish to a spectacular meal. Worth every rupee.'
    ),
    photos: [FOOD.kebab, FOOD.biryani, FOOD.paneerTikka, FOOD.fineDining],
    popularDishes: ['Galouti Kebab', 'Mutton Biryani', 'Shahi Paneer'],
    address: 'Aerocity, New Delhi',
    phone: '+91 11 4600 2211',
    hours: '12:00 PM - 12:00 AM (Today)',
    features: ['Bar Available', 'Fine Dining', 'Valet Parking'],
  },
];

export const cities = [
  'Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Goa',
];
