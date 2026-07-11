const db = require('./Config/db');
const Restaurant = require('./Models/RestrauntModel');
const Food = require('./Models/FoodModel');

const IMG = {
    indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    dosa: 'https://images.unsplash.com/photo-1627308595229-7830f5c95f9d?auto=format&fit=crop&w=800&q=80',
    chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    healthy: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    biryani: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80',
    thai: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    burger: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    res1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    res2: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    res3: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
};

const seedDatabase = async () => {
    try {
        // Keep this in sync with Server.js — alter existing tables to match
        // the current models rather than silently skipping missing columns.
        await db.sync({ alter: true });

        const count = await Restaurant.count();
        if (count > 0) {
            console.log('Database already has data. Skipping seed process.');
            process.exit(0);
        }

        console.log('Database is empty. Seeding data now...');

        const restaurants = [
            { id: '1', name: 'Bukhara', location: 'ITC Maurya, Chanakyapuri', address: 'ITC Maurya, Diplomatic Enclave, New Delhi', cuisine: ['North Indian', 'Mughlai', 'Kebab'], rating: 4.5, deliveryTime: '30-35 min', priceForTwo: 1200, distance: '2.5 km', image: IMG.res1, pureVeg: false, promoted: true, offer: '50% OFF up to ₹100', phone: '+91 11 2611 2233', hours: '12:30 PM - 12:45 AM', popularDishes: ['Dal Bukhara', 'Sikandari Raan', 'Tandoori Jhinga'], features: ['Parking Available', 'Indoor Seating'] },
            { id: '2', name: 'The Imperial Spice', location: 'Connaught Place', address: 'A-3, Connaught Place, New Delhi', cuisine: ['North Indian', 'Continental'], rating: 4.3, deliveryTime: '35-40 min', priceForTwo: 1500, distance: '3.1 km', image: IMG.res2, pureVeg: false, promoted: true, offer: 'Free delivery', phone: '+91 11 2334 5566', hours: '11:00 AM - 11:30 PM', popularDishes: ['Mutton Rogan Josh', 'Fish Tikka'], features: ['Bar Available', 'Live Music'] },
            { id: '3', name: 'Saravana Bhavan', location: 'Janpath', address: 'A-22, Janpath, New Delhi', cuisine: ['South Indian', 'Beverages'], rating: 4.4, deliveryTime: '25-30 min', priceForTwo: 400, distance: '1.8 km', image: IMG.res3, pureVeg: true, promoted: false, offer: '20% OFF up to ₹50', phone: '+91 11 2331 7740', hours: '7:00 AM - 11:00 PM', popularDishes: ['Masala Dosa', 'Idli Sambar'], features: ['Pure Veg', 'Family Friendly'] },
            { id: '4', name: 'Mainland China', location: 'Saket', address: 'E-12, Saket District Centre', cuisine: ['Chinese', 'Asian'], rating: 4.2, deliveryTime: '40-45 min', priceForTwo: 1800, distance: '5.2 km', image: IMG.chinese, pureVeg: false, promoted: true, offer: '40% OFF up to ₹80', phone: '+91 11 4170 2211', hours: '12:00 PM - 11:00 PM', popularDishes: ['Dim Sum', 'Kung Pao Chicken'], features: ['Bar Available', 'Indoor Seating'] },
            { id: '5', name: 'Trattoria', location: 'Vasant Vihar', address: 'B-8, Vasant Vihar', cuisine: ['Italian', 'Pizza'], rating: 4.6, deliveryTime: '30-40 min', priceForTwo: 2000, distance: '4.0 km', image: IMG.pizza, pureVeg: false, promoted: false, offer: 'Buy 1 Get 1 Free', phone: '+91 11 4160 2211', hours: '12:00 PM - 12:00 AM', popularDishes: ['Wood-fired Pizza', 'Tiramisu'], features: ['Bar Available', 'Outdoor Seating'] },
            { id: '6', name: 'Oh! Calcutta', location: 'Rajouri Garden', address: 'J-1/11, Rajouri Garden', cuisine: ['Bengali', 'Seafood'], rating: 4.3, deliveryTime: '35-45 min', priceForTwo: 1400, distance: '6.5 km', image: IMG.indian, pureVeg: false, promoted: false, offer: '30% OFF up to ₹75', phone: '+91 11 2510 2211', hours: '12:00 PM - 11:00 PM', popularDishes: ['Fish Curry', 'Rasgulla'], features: ['Indoor Seating'] },
            { id: '7', name: 'Pind Balluchi', location: 'Vasant Kunj', address: 'Ambience Mall', cuisine: ['North Indian', 'Punjabi'], rating: 4.1, deliveryTime: '25-35 min', priceForTwo: 800, distance: '7.2 km', image: IMG.res1, pureVeg: false, promoted: false, offer: 'Free dessert', phone: '+91 11 4600 2211', hours: '11:00 AM - 11:00 PM', popularDishes: ['Amritsari Chole', 'Lassi'], features: ['Family Friendly'] },
            { id: '8', name: 'The Cake Shop', location: 'Khan Market', address: 'Shop 14, Khan Market', cuisine: ['Bakery', 'Desserts'], rating: 4.7, deliveryTime: '20-25 min', priceForTwo: 600, distance: '2.0 km', image: IMG.cake, pureVeg: true, promoted: false, offer: '15% OFF', phone: '+91 11 2435 2211', hours: '9:00 AM - 10:00 PM', popularDishes: ['Red Velvet Cake', 'Cheesecake'], features: ['Pure Veg', 'Takeaway'] },
            { id: '9', name: 'Thai Pavilion', location: 'Dwarka', address: 'Taj Vivanta, Dwarka', cuisine: ['Thai', 'Asian'], rating: 4.4, deliveryTime: '40-50 min', priceForTwo: 2200, distance: '8.5 km', image: IMG.thai, pureVeg: false, promoted: true, offer: '50% OFF up to ₹120', phone: '+91 11 4600 2211', hours: '12:30 PM - 11:30 PM', popularDishes: ['Tom Yum Soup', 'Pad Thai'], features: ['Fine Dining', 'Valet Parking'] },
            { id: '10', name: 'Burrito Boys', location: 'Hauz Khas Village', address: 'Hauz Khas Village', cuisine: ['Mexican', 'Fast Food'], rating: 4.0, deliveryTime: '20-30 min', priceForTwo: 500, distance: '3.5 km', image: IMG.mexican, pureVeg: false, promoted: false, offer: 'Free chips & dip', phone: '+91 11 2696 2211', hours: '11:00 AM - 1:00 AM', popularDishes: ['Chicken Burrito', 'Nachos'], features: ['Casual Dining'] },
            { id: '11', name: 'Green Leaf', location: 'Cyber Hub', address: 'Cyber Hub, Gurugram', cuisine: ['Healthy', 'Salads'], rating: 4.2, deliveryTime: '25-30 min', priceForTwo: 700, distance: '5.8 km', image: IMG.healthy, pureVeg: true, promoted: false, offer: '10% OFF', phone: '+91 124 4600 2211', hours: '8:00 AM - 10:00 PM', popularDishes: ['Quinoa Bowl', 'Smoothie Bowl'], features: ['Pure Veg', 'Vegan Friendly'] },
            { id: '12', name: 'Royal Spice', location: 'Aerocity', address: 'Aerocity, New Delhi', cuisine: ['North Indian', 'Mughlai'], rating: 4.5, deliveryTime: '35-40 min', priceForTwo: 1600, distance: '9.0 km', image: IMG.biryani, pureVeg: false, promoted: true, offer: '40% OFF up to ₹100', phone: '+91 11 4600 2211', hours: '12:00 PM - 12:00 AM', popularDishes: ['Galouti Kebab', 'Mutton Biryani'], features: ['Fine Dining'] }
        ];

        const formattedRestaurants = restaurants.map(r => ({
            ...r,
            cuisine: r.cuisine, 
            popularDishes: r.popularDishes,
            features: r.features,
            menu: [], photos: [], reviews: []
        }));

        await Restaurant.bulkCreate(formattedRestaurants);

        const foods = [
            { restrauntId: 1, name: 'Dal Bukhara', description: 'Slow-cooked black urad dal simmered overnight', price: 380, category: 'Signature', imageUrl: IMG.indian },
            { restrauntId: 1, name: 'Sikandari Raan', description: 'Whole leg of lamb marinated in 36 spices', price: 890, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 1, name: 'Tandoori Jhinga', description: 'Char-grilled tiger prawns with smoked paprika', price: 720, category: 'Starters', imageUrl: IMG.indian },
            { restrauntId: 1, name: 'Murgh Malai Tikka', description: 'Creamy chicken tikka with cardamom', price: 540, category: 'Starters', imageUrl: IMG.indian },
            { restrauntId: 1, name: 'Bukhara Naan', description: 'Hand-stretched naan baked in clay tandoor', price: 80, category: 'Breads', imageUrl: IMG.indian },
            { restrauntId: 1, name: 'Phirni', description: 'Chilled ground rice pudding with saffron', price: 180, category: 'Desserts', imageUrl: IMG.cake },
            
            { restrauntId: 2, name: 'Mutton Rogan Josh', description: 'Kashmiri-style mutton in aromatic red gravy', price: 560, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 2, name: 'Fish Tikka', description: 'Basa fillet marinated in yogurt and ajwain', price: 480, category: 'Starters', imageUrl: IMG.indian },
            { restrauntId: 2, name: 'Imperial Thali', description: 'Assorted platter with 2 mains, 2 starters', price: 1200, category: 'Specials', imageUrl: IMG.indian },
            { restrauntId: 2, name: 'Shahi Paneer', description: 'Cottage cheese in rich cashew and saffron gravy', price: 340, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 2, name: 'Garlic Naan', description: 'Tandoor-baked naan brushed with garlic butter', price: 60, category: 'Breads', imageUrl: IMG.indian },
            { restrauntId: 2, name: 'Kulfi Falooda', description: 'Traditional Indian ice cream with vermicelli', price: 220, category: 'Desserts', imageUrl: IMG.cake },

            { restrauntId: 3, name: 'Masala Dosa', description: 'Crispy rice crepe stuffed with spiced potato masala', price: 140, category: 'Dosas', imageUrl: IMG.dosa },
            { restrauntId: 3, name: 'Idli Sambar', description: 'Steamed rice cakes with lentil sambar', price: 90, category: 'Breakfast', imageUrl: IMG.dosa },
            { restrauntId: 3, name: 'Filter Coffee', description: 'Authentic South Indian decoction with frothy milk', price: 50, category: 'Beverages', imageUrl: IMG.res1 },
            { restrauntId: 3, name: 'Rava Onion Dosa', description: 'Semolina crepe with caramelized onions', price: 160, category: 'Dosas', imageUrl: IMG.dosa },
            { restrauntId: 3, name: 'Mini Tiffin', description: 'Assorted: idli, vada, pongal, kesari', price: 280, category: 'Specials', imageUrl: IMG.dosa },
            { restrauntId: 3, name: 'Curd Rice', description: 'Tempered yogurt rice with pomegranate', price: 120, category: 'Rice', imageUrl: IMG.dosa },

            { restrauntId: 4, name: 'Chicken Dim Sum', description: 'Steamed chicken dumplings with spicy Sichuan dip', price: 320, category: 'Dim Sum', imageUrl: IMG.chinese },
            { restrauntId: 4, name: 'Kung Pao Chicken', description: 'Wok-tossed chicken with peanuts and chilies', price: 440, category: 'Mains', imageUrl: IMG.chinese },
            { restrauntId: 4, name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and soy glaze', price: 280, category: 'Noodles', imageUrl: IMG.chinese },
            { restrauntId: 4, name: 'Veg Spring Rolls', description: 'Crispy rolls stuffed with julienned vegetables', price: 220, category: 'Starters', imageUrl: IMG.chinese },
            { restrauntId: 4, name: 'Schezwan Fried Rice', description: 'Spicy fried rice with schezwan sauce', price: 260, category: 'Rice', imageUrl: IMG.chinese },
            { restrauntId: 4, name: 'Date Pancake', description: 'Crispy date pancake with toffee sauce', price: 240, category: 'Desserts', imageUrl: IMG.cake },

            { restrauntId: 5, name: 'Margherita Pizza', description: 'Wood-fired pizza with San Marzano tomato', price: 420, category: 'Pizza', imageUrl: IMG.pizza },
            { restrauntId: 5, name: 'Pasta Carbonara', description: 'Spaghetti with pancetta, egg yolk, pecorino', price: 480, category: 'Pasta', imageUrl: IMG.pizza },
            { restrauntId: 5, name: 'Quattro Formaggi', description: 'Four cheese pizza with mozzarella, gorgonzola', price: 520, category: 'Pizza', imageUrl: IMG.pizza },
            { restrauntId: 5, name: 'Bruschetta', description: 'Toasted ciabatta with tomato, basil and olive oil', price: 240, category: 'Starters', imageUrl: IMG.pizza },
            { restrauntId: 5, name: 'Tiramisu', description: 'Coffee-soaked ladyfingers with mascarpone', price: 280, category: 'Desserts', imageUrl: IMG.cake },
            { restrauntId: 5, name: 'Garlic Bread', description: 'Wood-fired bread with garlic butter and herbs', price: 180, category: 'Starters', imageUrl: IMG.pizza },

            { restrauntId: 6, name: 'Chingri Malai Curry', description: 'Prawns in coconut milk gravy', price: 560, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 6, name: 'Bhetki Paturi', description: 'Barramundi fillet steamed in banana leaf', price: 480, category: 'Starters', imageUrl: IMG.indian },
            { restrauntId: 6, name: 'Aloo Posto', description: 'Potato in poppy seed paste', price: 220, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 6, name: 'Kosha Mangsho', description: 'Slow-cooked mutton in rich onion gravy', price: 420, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 6, name: 'Rasgulla', description: 'Spongy cottage cheese balls in light sugar syrup', price: 120, category: 'Desserts', imageUrl: IMG.cake },
            { restrauntId: 6, name: 'Luchi Aloo Dum', description: 'Fluffy fried puri with spicy potato curry', price: 180, category: 'Breakfast', imageUrl: IMG.indian },

            { restrauntId: 7, name: 'Amritsari Chole', description: 'Spiced chickpeas with ginger', price: 220, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 7, name: 'Sarson Ka Saag', description: 'Mustard greens with white butter', price: 280, category: 'Mains', imageUrl: IMG.healthy },
            { restrauntId: 7, name: 'Sweet Lassi', description: 'Thick yogurt drink with sugar and cardamom', price: 80, category: 'Beverages', imageUrl: IMG.healthy },
            { restrauntId: 7, name: 'Tandoori Chicken', description: 'Half chicken marinated in yogurt', price: 360, category: 'Starters', imageUrl: IMG.indian },
            { restrauntId: 7, name: 'Butter Naan', description: 'Soft naan with butter, baked in tandoor', price: 50, category: 'Breads', imageUrl: IMG.indian },
            { restrauntId: 7, name: 'Gajar Ka Halwa', description: 'Carrot pudding with ghee, nuts and khoya', price: 140, category: 'Desserts', imageUrl: IMG.cake },

            { restrauntId: 8, name: 'Red Velvet Cake', description: 'Moist cocoa cake with cream cheese frosting', price: 450, category: 'Cakes', imageUrl: IMG.cake },
            { restrauntId: 8, name: 'Chocolate Truffle', description: 'Rich dark chocolate ganache cake', price: 480, category: 'Cakes', imageUrl: IMG.cake },
            { restrauntId: 8, name: 'New York Cheesecake', description: 'Classic baked cheesecake with biscuit base', price: 380, category: 'Cakes', imageUrl: IMG.cake },
            { restrauntId: 8, name: 'Cupcakes (6 pc)', description: 'Assorted flavored cupcakes with buttercream', price: 360, category: 'Pastries', imageUrl: IMG.cake },
            { restrauntId: 8, name: 'Fresh Fruit Tart', description: 'Vanilla custard tart with seasonal fresh fruits', price: 220, category: 'Pastries', imageUrl: IMG.cake },
            { restrauntId: 8, name: 'Gulab Jamun (1 kg)', description: 'Soft milk dumplings soaked in syrup', price: 320, category: 'Indian Sweets', imageUrl: IMG.cake },

            { restrauntId: 9, name: 'Tom Yum Goong', description: 'Spicy and sour soup with prawns', price: 340, category: 'Soups', imageUrl: IMG.thai },
            { restrauntId: 9, name: 'Pad Thai', description: 'Stir-fried rice noodles with tofu, peanuts', price: 380, category: 'Noodles', imageUrl: IMG.thai },
            { restrauntId: 9, name: 'Green Curry Chicken', description: 'Chicken in coconut green curry with Thai basil', price: 420, category: 'Curries', imageUrl: IMG.thai },
            { restrauntId: 9, name: 'Som Tum', description: 'Green papaya salad with lime, chili', price: 260, category: 'Salads', imageUrl: IMG.healthy },
            { restrauntId: 9, name: 'Massaman Curry', description: 'Mild curry with potato, peanuts', price: 440, category: 'Curries', imageUrl: IMG.thai },
            { restrauntId: 9, name: 'Mango Sticky Rice', description: 'Sweet sticky rice with fresh mango', price: 240, category: 'Desserts', imageUrl: IMG.cake },

            { restrauntId: 10, name: 'Chicken Burrito', description: 'Grilled chicken, rice, beans, salsa in tortilla', price: 280, category: 'Burritos', imageUrl: IMG.mexican },
            { restrauntId: 10, name: 'Nachos Supreme', description: 'Tortilla chips with cheese, jalapenos, salsa', price: 240, category: 'Starters', imageUrl: IMG.mexican },
            { restrauntId: 10, name: 'Veg Quesadilla', description: 'Grilled tortilla with cheese, beans', price: 220, category: 'Main', imageUrl: IMG.mexican },
            { restrauntId: 10, name: 'Loaded Fries', description: 'Fries topped with cheese sauce, jalapenos', price: 180, category: 'Sides', imageUrl: IMG.burger },
            { restrauntId: 10, name: 'Chicken Tacos (3 pc)', description: 'Soft tacos with grilled chicken, slaw', price: 260, category: 'Tacos', imageUrl: IMG.mexican },
            { restrauntId: 10, name: 'Churros', description: 'Fried dough sticks with chocolate sauce', price: 160, category: 'Desserts', imageUrl: IMG.cake },

            { restrauntId: 11, name: 'Quinoa Power Bowl', description: 'Quinoa, roasted veggies, chickpeas', price: 320, category: 'Bowls', imageUrl: IMG.healthy },
            { restrauntId: 11, name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan', price: 280, category: 'Salads', imageUrl: IMG.healthy },
            { restrauntId: 11, name: 'Acai Smoothie Bowl', description: 'Acai blend topped with granola, banana', price: 300, category: 'Bowls', imageUrl: IMG.healthy },
            { restrauntId: 11, name: 'Avocado Toast', description: 'Sourdough with smashed avocado, chili flakes', price: 240, category: 'Sandwiches', imageUrl: IMG.healthy },
            { restrauntId: 11, name: 'Buddha Bowl', description: 'Brown rice, tofu, edamame, avocado', price: 340, category: 'Bowls', imageUrl: IMG.healthy },
            { restrauntId: 11, name: 'Green Detox Juice', description: 'Kale, spinach, cucumber, apple and ginger', price: 180, category: 'Juices', imageUrl: IMG.healthy },

            { restrauntId: 12, name: 'Galouti Kebab', description: 'Melt-in-mouth minced mutton kebabs', price: 420, category: 'Starters', imageUrl: IMG.indian },
            { restrauntId: 12, name: 'Mutton Biryani', description: 'Dum-cooked basmati with tender mutton', price: 480, category: 'Biryani', imageUrl: IMG.biryani },
            { restrauntId: 12, name: 'Shahi Paneer', description: 'Cottage cheese in royal cashew gravy', price: 360, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 12, name: 'Sheermal', description: 'Saffron-flavored sweet bread baked in tandoor', price: 80, category: 'Breads', imageUrl: IMG.indian },
            { restrauntId: 12, name: 'Chicken Korma', description: 'Chicken in creamy yogurt and nut gravy', price: 400, category: 'Mains', imageUrl: IMG.indian },
            { restrauntId: 12, name: 'Shahi Tukda', description: 'Fried bread soaked in rabri with nuts', price: 200, category: 'Desserts', imageUrl: IMG.cake }
        ];

        await Food.bulkCreate(foods);

        console.log('Database successfully seeded with ALL 12 Restaurants and 72 Food Items!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();