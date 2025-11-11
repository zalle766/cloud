-- Check if restaurant with ID 12 exists
SELECT * FROM restaurants WHERE id = 12;

-- Check all restaurants
SELECT id, name, status FROM restaurants ORDER BY id;

-- Check restaurant count
SELECT COUNT(*) as total_restaurants FROM restaurants;




