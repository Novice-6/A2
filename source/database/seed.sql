-- ============================================================
-- PROG2002 Web Development II - Charity Events website
-- A2 project: A / A2-1  (Green Tomorrow - conservation theme)
-- Sample data for charityevents_db
--
-- Run schema.sql first, then this file.
--   mysql -u root -p < source/database/seed.sql
--
-- Contents: 4 categories, 3 charity organisations, 8 events.
-- ============================================================

USE charityevents_db;

SET NAMES utf8mb4;

-- Cleared child-first so the foreign keys stay valid on a re-import.
DELETE FROM events;
DELETE FROM categories;
DELETE FROM charities;

-- ------------------------------------------------------------
-- categories
-- ------------------------------------------------------------
INSERT INTO categories (id, name, description) VALUES
  (1, 'Forest', 'Woodland restoration and tree planting across shared green spaces.'),
  (2, 'Ocean', 'Shoreline, river and coastal clean-up for healthier water.'),
  (3, 'Wildlife', 'Habitat surveys that keep local species visible and protected.'),
  (4, 'Community', 'Neighbourhood action that makes conservation part of daily life.');

-- ------------------------------------------------------------
-- charities
-- ------------------------------------------------------------
INSERT INTO charities (id, name, slug, focus, email, city) VALUES
  (1, 'Green Tomorrow Trust', 'green-tomorrow-trust', 'Forest restoration', 'hello@greentomorrow.org', 'Green Valley'),
  (2, 'Blue Shore Alliance', 'blue-shore-alliance', 'Ocean clean-up', 'team@blueshore.org', 'East Coast'),
  (3, 'Green Tomorrow Volunteers', 'green-tomorrow-volunteers', 'Community action', 'volunteers@greentomorrow.org', 'North River');

-- ------------------------------------------------------------
-- events
-- category_id references categories.id, charity_id references charities.id
-- ------------------------------------------------------------
INSERT INTO events
  (id, title, category_id, charity_id, event_date, event_time, location, status, image, description, purpose, price, goal_amount, raised_amount, service_type)
VALUES
  (1, 'Community Tree Planting', 1, 1, '2026-10-12', '09:00:00', 'Green Valley Park', 'upcoming', 'E-01.jpg',
   'Plant native trees with local volunteers and restore a shared woodland.',
   'Restore native woodland so local wildlife and families have a greener place to share.',
   'Free entry', 5000.00, 1800.00, NULL),
  (2, 'River Cleanup Day', 1, 1, '2026-10-19', '08:30:00', 'North River', 'upcoming', 'E-02.jpg',
   'Remove litter and protect the river habitat with a guided community team.',
   'Keep the river habitat clean so woodland species can feed and nest safely.',
   'Free · donations welcome', 3000.00, 1200.00, NULL),
  (3, 'Forest Canopy Survey', 1, 1, '2026-11-02', '07:30:00', 'Pine Ridge', 'upcoming', 'E-05.jpg',
   'Support a simple biodiversity survey and learn about local canopy health.',
   'Track canopy health so restoration work targets the trees that need it most.',
   'Free entry', 2500.00, 900.00, NULL),
  (4, 'Coastal Conservation Walk', 2, 2, '2026-11-09', '09:30:00', 'East Coast', 'upcoming', 'E-08.jpg',
   'Record shoreline conditions and share practical conservation actions.',
   'Document shoreline change so coastal habitats are protected before damage spreads.',
   'Suggested donation 50', 4000.00, 2600.00, NULL),
  (5, 'Wildlife Watch at Dawn', 3, 1, '2026-11-21', '06:30:00', 'Green Valley Park', 'ongoing', 'E-03.jpg',
   'Join an early survey of birds and small mammals across the woodland edge.',
   'Count local species so woodland management keeps every habitat in balance.',
   'Free entry', 2000.00, 2000.00, NULL),
  (6, 'Community Food Forest Day', 4, 3, '2026-11-28', '10:00:00', 'North River', 'upcoming', 'E-04.jpg',
   'Build a shared food forest with neighbours and learn low-cost growing skills.',
   'Grow free food together so every household can take part in local conservation.',
   'Free · donations welcome', 6000.00, 1500.00, NULL),
  (7, 'Ocean Plastic Survey', 2, 2, '2026-12-05', '08:00:00', 'Harbor Shoreline', 'upcoming', 'E-06.jpg',
   'Measure plastic litter along the shore and feed the results to clean-up teams.',
   'Map plastic pollution so clean-up crews can stop it at the source.',
   'Suggested donation 50', 3500.00, 2100.00, NULL),
  (8, 'Forest Trail Restoration', 1, 1, '2026-12-12', '09:00:00', 'Pine Ridge', 'suspended', 'E-07.jpg',
   'Repair woodland trails and replant worn edges with hardy native species.',
   'Rebuild walking trails so restored woodland stays open to the whole community.',
   'Free entry', 4500.00, 600.00, NULL);
