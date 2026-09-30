// ============================================================
//  PROG2002 Assessment 2 — server.js
//  Express REST API serving charity event data from MySQL.
// ============================================================

const express = require('express');
const path = require('path');
const db = require('./event_db');

const app = express();
const port = Number(process.env.PORT || 3201);

// ---- Shared SQL fragments ---------------------------------
// Derive status from event_date vs today; exclude suspended rows.
const SELECT_EVENT = `
  SELECT
    e.id,
    e.name                                     AS title,
    c.name                                     AS category,
    o.name                                     AS organisation,
    e.purpose,
    e.description,
    DATE_FORMAT(e.event_date, '%Y-%m-%d')      AS date,
    TIME_FORMAT(e.start_time, '%H:%i')         AS start_time,
    e.location,
    e.ticket_price                             AS price,
    e.goal_amount                              AS goal,
    e.raised_amount                            AS raised,
    e.image,
    e.suspended,
    CASE WHEN e.event_date < CURDATE() THEN 'past' ELSE 'upcoming' END AS status
  FROM events e
  JOIN categories c    ON c.id = e.category_id
  JOIN organisations o ON o.id = e.organisation_id
`;

const ACTIVE_UPCOMING = ` WHERE e.suspended = 0 AND e.event_date >= CURDATE() `;

// ---- Static assets ----------------------------------------
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// ---- Routes -----------------------------------------------

// Categories (names) — used to populate the search filter.
app.get('/api/categories', async (_req, res, next) => {
  try {
    const rows = await db.query(
      `SELECT id, name FROM categories ORDER BY name`,
    );
    res.json(rows.map((row) => row.name));
  } catch (err) {
    next(err);
  }
});

// Homepage featured events (active & upcoming).
app.get('/api/events/featured', async (_req, res, next) => {
  try {
    const rows = await db.query(
      `${SELECT_EVENT}${ACTIVE_UPCOMING}ORDER BY e.event_date ASC LIMIT 3`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Search events by keyword / category / date / location.
// NOTE: must be declared before '/api/events/:id'.
app.get('/api/events/search', async (req, res, next) => {
  try {
    const keyword = String(req.query.keyword || '').trim();
    const category = String(req.query.category || '').trim();
    const date = String(req.query.date || '').trim();
    const location = String(req.query.location || '').trim();

    const where = [`e.suspended = 0`];
    const params = [];

    if (keyword) {
      where.push(`(e.name LIKE ? OR e.description LIKE ? OR e.location LIKE ?)`);
      const like = `%${keyword}%`;
      params.push(like, like, like);
    }
    if (category) {
      where.push(`c.name = ?`);
      params.push(category);
    }
    if (date) {
      where.push(`e.event_date = ?`);
      params.push(date);
    }
    if (location) {
      where.push(`e.location LIKE ?`);
      params.push(`%${location}%`);
    }

    const rows = await db.query(
      `${SELECT_EVENT} WHERE ${where.join(' AND ')} ORDER BY e.event_date ASC`,
      params,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// All active & upcoming events (generic list).
app.get('/api/events', async (_req, res, next) => {
  try {
    const rows = await db.query(
      `${SELECT_EVENT}${ACTIVE_UPCOMING}ORDER BY e.event_date ASC`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Event detail by id (includes gallery + goal progress).
app.get('/api/events/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid event id' });
    }
    const rows = await db.query(`${SELECT_EVENT} WHERE e.id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const event = rows[0];
    // Simple gallery: main image + a couple of shared assets.
    event.gallery = [event.image, 'E-05.jpg'].filter(Boolean);
    // Progress percentage for the goal bar (0 when no goal set).
    event.progress = event.goal > 0
      ? Math.min(100, Math.round((event.raised / event.goal) * 100))
      : 0;
    res.json(event);
  } catch (err) {
    next(err);
  }
});

// 404 for unknown API routes.
app.use('/api', (_req, res) => res.status(404).json({ message: 'API route not found' }));

// Error handler.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () =>
  console.log(`Charity Events API listening on http://localhost:${port}`),
);
