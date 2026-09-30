const $ = (selector, root = document) => root.querySelector(selector);
const api = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Request failed");
  return response.json();
};
const escapeText = (value) => String(value ?? "");
const card = (event) => {
  const theme = "A";
  const fallback = `[${theme} · ${event.category.toUpperCase()} EVENT]`;
  const media = event.image
    ? `<img src="/assets/${encodeURIComponent(event.image)}" alt="${escapeText(event.title)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement("span"), { textContent: fallback }))">`
    : fallback;
  return `<article class="event-card"><div class="placeholder-media" aria-label="Event image">${media}</div><div class="event-card-body"><span class="status">${escapeText(event.status)}</span><h3>${escapeText(event.title)}</h3><p class="meta">${escapeText(event.date)} · ${escapeText(event.location)}</p><a class="button secondary" href="event.html?id=${event.id}">View details</a></div></article>`;
};
const showState = (node, text) => {
  if (node) node.innerHTML = `<div class="state" role="status">${text}</div>`;
};
