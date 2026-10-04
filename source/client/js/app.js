const $ = (selector, root = document) => root.querySelector(selector);
const api = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Request failed");
  return response.json();
};
const escapeText = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
// Today's date in the browser's local timezone, as 'YYYY-MM-DD', so it can be
// compared directly with the DATE strings the API returns.
const localToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
// Events that are already running keep their own Ongoing label; every other
// event is marked Past or Upcoming from its date, so the label stays correct
// as the calendar moves.
const dateState = (event) => {
  if (event.status === "ongoing") return "Ongoing";
  return event.date < localToday() ? "Past" : "Upcoming";
};
const card = (event) => {
  const theme = "A";
  const fallback = `[${theme} · ${event.category.toUpperCase()} EVENT]`;
  const media = event.image
    ? `<img src="/assets/${encodeURIComponent(event.image)}" alt="${escapeText(event.title)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement("span"), { textContent: fallback }))">`
    : fallback;
  const state = dateState(event);
  return `<article class="event-card"><div class="placeholder-media" aria-label="Event image">${media}</div><div class="event-card-body"><span class="status">${escapeText(event.category)}</span><span class="status date-${state.toLowerCase()}">${state}</span><h3>${escapeText(event.title)}</h3><p class="meta">${escapeText(event.date)} · ${escapeText(event.location)}</p><a class="button secondary" href="event.html?id=${event.id}">View details</a></div></article>`;
};
const showState = (node, text) => {
  if (node) node.innerHTML = `<div class="state" role="status">${text}</div>`;
};
