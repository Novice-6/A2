-- ============================================================
--  PROG2002 Assessment 2
--  Charity Events Website — Database schema + sample data
--  Database: charityevents_db
--  Tables: organisations, categories, events
-- ============================================================

-- Create the database (safe to re-run)
CREATE DATABASE IF NOT EXISTS charityevents_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE charityevents_db;

-- ------------------------------------------------------------
-- 1. charitable organisations
-- ------------------------------------------------------------
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organisations;

CREATE TABLE organisations (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  mission       TEXT         NOT NULL,
  contact_email VARCHAR(120) NOT NULL,
  contact_phone VARCHAR(40)  NULL,
  website       VARCHAR(200) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. event categories (fun run, gala, auction, concert, ...)
-- ------------------------------------------------------------
CREATE TABLE categories (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(80)  NOT NULL,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_category_name (name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. charity events
--    `status` is intentionally NOT stored — it is derived from
--    event_date vs CURRENT_DATE, plus the `suspended` flag.
-- ------------------------------------------------------------
CREATE TABLE events (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  organisation_id  INT UNSIGNED NOT NULL,
  category_id      INT UNSIGNED NOT NULL,
  name             VARCHAR(160) NOT NULL,
  purpose          VARCHAR(255) NOT NULL,      -- why the event exists
  description      TEXT         NOT NULL,      -- full description
  event_date       DATE         NOT NULL,
  start_time       TIME         NOT NULL,
  location         VARCHAR(200) NOT NULL,
  ticket_price     DECIMAL(10,2) NOT NULL DEFAULT 0.00,  -- 0.00 = free
  goal_amount      DECIMAL(12,2) NOT NULL DEFAULT 0.00,  -- fundraising target
  raised_amount    DECIMAL(12,2) NOT NULL DEFAULT 0.00,  -- progress so far
  image            VARCHAR(120) NULL,          -- e.g. E-01.jpg
  suspended        TINYINT(1)   NOT NULL DEFAULT 0,      -- 1 = hidden from site
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_event_date (event_date),
  KEY idx_category (category_id),
  CONSTRAINT fk_events_org      FOREIGN KEY (organisation_id) REFERENCES organisations (id),
  CONSTRAINT fk_events_category FOREIGN KEY (category_id)     REFERENCES categories (id)
) ENGINE=InnoDB;

-- ============================================================
--  Sample data
-- ============================================================

INSERT INTO organisations (name, mission, contact_email, contact_phone, website) VALUES
  ('Green Tomorrow', 'Protect local woodlands and waterways through open, community-led action.', 'hello@greentomorrow.org', '+61 2 6000 1000', 'https://greentomorrow.org'),
  ('City Care Foundation', 'Raise funds and awareness for vulnerable communities across the city.', 'info@citycare.org.au', '+61 2 6000 2000', 'https://citycare.org.au'),
  ('Hope for Kids', 'Support children and families in need through education and wellbeing programs.', 'team@hopeforkids.org.au', '+61 2 6000 3000', 'https://hopeforkids.org.au');

INSERT INTO categories (name, description) VALUES
  ('Fun Run', 'Community running and walking events to raise funds through entry donations.'),
  ('Gala Dinner', 'Formal evening events with ticketed dinners and auctions.'),
  ('Silent Auction', 'Bid on donated items to raise money for a cause.'),
  ('Concert', 'Live music events where ticket sales support the charity.'),
  ('Community', 'Hands-on volunteering and awareness-raising events.');

INSERT INTO events
  (organisation_id, category_id, name, purpose, description, event_date, start_time, location, ticket_price, goal_amount, raised_amount, image, suspended)
VALUES
  (1, 5, 'Community Tree Planting Day', 'Restore a shared local woodland', 'Join volunteers to plant native trees and restore a shared woodland. Tools and seedlings provided; families welcome.', '2026-10-12', '09:00:00', 'Green Valley Park', 0.00, 5000.00, 1820.00, 'E-01.jpg', 0),
  (1, 5, 'River Cleanup Morning', 'Protect the river habitat', 'Remove litter and protect the river habitat with a guided community team. Gloves and bags provided.', '2026-10-19', '08:30:00', 'North River', 0.00, 3000.00, 750.00, 'E-02.jpg', 0),
  (1, 3, 'Forest Canopy Silent Auction', 'Fund a biodiversity survey', 'Bid on donated artworks and outdoor gear. Every dollar supports a local biodiversity survey.', '2026-11-02', '18:00:00', 'Pine Ridge Community Hall', 15.00, 20000.00, 9400.00, 'E-05.jpg', 0),
  (2, 1, 'City Fun Run 5k', 'Raise funds for community programs', 'Run or walk 5k through the city. Entry is a donation; medals for all finishers.', '2026-10-25', '07:00:00', 'Harbourfront Esplanade', 25.00, 40000.00, 12300.00, 'E-04.jpg', 0),
  (2, 4, 'Charity Spring Concert', 'Support youth music programs', 'An evening of live music with all ticket sales supporting youth programs.', '2026-11-15', '19:30:00', 'City Concert Hall', 45.00, 30000.00, 0.00, 'E-03.jpg', 0),
  (3, 2, 'Hope Gala Dinner', 'Fund children education initiatives', 'A ticketed gala dinner with guest speakers and a live pledge drive for children education.', '2026-11-20', '18:30:00', 'Grand Hotel Ballroom', 120.00, 80000.00, 45000.00, 'E-06.jpg', 0),
  (3, 1, 'Kids Colour Run', 'Raise awareness for family support', 'A colourful family fun run; every entry supports family support services.', '2026-12-06', '10:00:00', 'Riverside Oval', 12.00, 15000.00, 2100.00, 'E-07.jpg', 0),
  (2, 3, 'Coastal Art Auction', 'Protect coastal habitats', 'Bid on coastal-themed art to fund shoreline conservation projects.', '2026-12-12', '17:30:00', 'East Coast Gallery', 20.00, 25000.00, 0.00, 'E-08.jpg', 0),
  (1, 5, 'Forest Canopy Survey (Suspended)', 'Survey local canopy health', 'A guided biodiversity survey. This event has been suspended pending review.', '2026-10-05', '09:00:00', 'Pine Ridge', 0.00, 1000.00, 0.00, 'E-05.jpg', 1);

-- End of file
