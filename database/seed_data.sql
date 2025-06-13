-- Seed data for Nigerian Food Ecommerce Application

-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Rice Dishes', 'rice-dishes', 'Jollof, Fried Rice, Coconut Rice', '/placeholder.svg?height=200&width=300'),
('Soups & Stews', 'soups-stews', 'Egusi, Pepper Soup, Okra Soup', '/placeholder.svg?height=200&width=300'),
('Grilled & BBQ', 'grilled-bbq', 'Suya, Grilled Fish, BBQ Chicken', '/placeholder.svg?height=200&width=300'),
('Swallow Foods', 'swallow-foods', 'Pounded Yam, Fufu, Amala', '/placeholder.svg?height=200&width=300'),
('Snacks & Sides', 'snacks-sides', 'Puff Puff, Plantain, Moi Moi', '/placeholder.svg?height=200&width=300'),
('Drinks', 'drinks', 'Zobo, Palm Wine, Fresh Juices', '/placeholder.svg?height=200&width=300');

-- Insert sample users
INSERT INTO users (email, password_hash, name, phone, address, role) VALUES
('admin@naijadelights.com', '$2b$10$hashedpassword1', 'Admin User', '+234 803 123 4567', '123 Victoria Island, Lagos', 'admin'),
('user@example.com', '$2b$10$hashedpassword2', 'John Doe', '+234 805 987 6543', '456 Ikeja, Lagos', 'customer'),
('customer@test.com', '$2b$10$hashedpassword3', 'Jane Smith', '+234 807 555 1234', '789 Surulere, Lagos', 'customer');

-- Insert products
INSERT INTO products (name, description, price, original_price, image_url, category_id, rating, review_count, is_popular, preparation_time) VALUES
('Jollof Rice with Chicken', 'Our signature jollof rice cooked with aromatic spices and served with tender grilled chicken', 2500.00, 3000.00, '/placeholder.svg?height=300&width=400', 1, 4.8, 124, TRUE, '25-30 mins'),
('Beef Suya Platter', 'Spicy grilled beef skewers marinated in traditional suya spice blend', 1800.00, NULL, '/placeholder.svg?height=300&width=400', 3, 4.9, 89, TRUE, '15-20 mins'),
('Egusi Soup with Pounded Yam', 'Rich melon seed soup with assorted meat and fresh vegetables, served with smooth pounded yam', 3200.00, NULL, '/placeholder.svg?height=300&width=400', 2, 4.7, 156, FALSE, '35-40 mins'),
('Pepper Soup (Goat Meat)', 'Spicy and aromatic soup with tender goat meat and traditional herbs', 2800.00, NULL, '/placeholder.svg?height=300&width=400', 2, 4.6, 78, FALSE, '30-35 mins'),
('Fried Rice with Plantain', 'Colorful fried rice with mixed vegetables served with sweet fried plantain', 2200.00, NULL, '/placeholder.svg?height=300&width=400', 1, 4.5, 92, FALSE, '20-25 mins'),
('Amala with Ewedu and Gbegiri', 'Traditional yam flour swallow served with ewedu and gbegiri soups', 2000.00, NULL, '/placeholder.svg?height=300&width=400', 4, 4.4, 67, FALSE, '25-30 mins'),
('Grilled Fish with Jollof Rice', 'Fresh grilled tilapia fish seasoned with Nigerian spices, served with jollof rice', 3500.00, NULL, '/placeholder.svg?height=300&width=400', 3, 4.8, 103, TRUE, '30-35 mins'),
('Pounded Yam with Ogbono Soup', 'Smooth pounded yam served with rich ogbono soup and assorted meat', 2800.00, NULL, '/placeholder.svg?height=300&width=400', 4, 4.6, 85, FALSE, '30-35 mins'),
('Chicken Pepper Soup', 'Spicy chicken soup with traditional Nigerian pepper soup spices', 2200.00, NULL, '/placeholder.svg?height=300&width=400', 2, 4.5, 71, FALSE, '25-30 mins'),
('Moi Moi (Bean Pudding)', 'Steamed bean pudding with boiled eggs and fish, a Nigerian delicacy', 800.00, NULL, '/placeholder.svg?height=300&width=400', 5, 4.3, 54, FALSE, '15-20 mins'),
('Puff Puff (6 pieces)', 'Sweet deep-fried dough balls, perfect as a snack or dessert', 600.00, NULL, '/placeholder.svg?height=300&width=400', 5, 4.2, 89, FALSE, '10-15 mins'),
('Zobo Drink (1 Liter)', 'Refreshing hibiscus drink with natural fruits and spices', 500.00, NULL, '/placeholder.svg?height=300&width=400', 6, 4.4, 76, FALSE, '5 mins'),
('Coconut Rice with Chicken', 'Fragrant coconut rice cooked in coconut milk, served with grilled chicken', 2700.00, NULL, '/placeholder.svg?height=300&width=400', 1, 4.6, 94, FALSE, '25-30 mins'),
('Bitterleaf Soup with Fufu', 'Traditional bitterleaf soup with assorted meat, served with fufu', 3000.00, NULL, '/placeholder.svg?height=300&width=400', 2, 4.5, 68, FALSE, '35-40 mins'),
('Suya Spice Grilled Chicken', 'Whole grilled chicken marinated in authentic suya spice blend', 4500.00, NULL, '/placeholder.svg?height=300&width=400', 3, 4.9, 112, TRUE, '40-45 mins'),
('Palm Wine (Fresh)', 'Fresh palm wine tapped from oil palm trees, served chilled', 800.00, NULL, '/placeholder.svg?height=300&width=400', 6, 4.1, 43, FALSE, '2 mins');

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Amazing jollof rice! Tastes just like my grandmother used to make.'),
(3, 1, 5, 'Best jollof rice in Lagos. The chicken was perfectly grilled.'),
(2, 2, 5, 'Authentic suya taste. Very spicy and delicious!'),
(3, 3, 4, 'Good egusi soup but could use more meat.'),
(2, 7, 5, 'Fresh fish and excellent seasoning. Highly recommended!');

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, delivery_fee, status, delivery_address, phone, notes) VALUES
(2, 4300.00, 500.00, 'delivered', '456 Ikeja, Lagos', '+234 805 987 6543', 'Please call when you arrive'),
(3, 2500.00, 0.00, 'pending', '789 Surulere, Lagos', '+234 807 555 1234', 'Extra spicy please');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 2500.00),
(1, 2, 1, 1800.00),
(2, 1, 1, 2500.00);
