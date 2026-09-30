document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  const root = document.querySelector("#event-detail");
  const label = "A";
  if (!id) return showState(root, "Event ID is missing.");
  try {
    const event = await api(`/api/events/${encodeURIComponent(id)}`);
    const image = (name, alt) =>
      `<img src="/assets/${encodeURIComponent(name)}" alt="${escapeText(alt)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement("span"), { textContent: "[${label} · IMAGE UNAVAILABLE]" }))">`;
    const gallery = (event.gallery || [event.image])
      .filter(Boolean)
      .map(
        (name) =>
          `<div class="placeholder-media">${image(name, event.title)}</div>`,
      )
      .join("");
    root.innerHTML = `<div class="event-layout"><div><div class="placeholder-media">${image(event.image, event.title)}</div><div class="gallery">${gallery}</div></div><div><span class="status">${escapeText(event.status)}</span><h1>${escapeText(event.title)}</h1><div class="facts"><div class="fact"><small>Date</small>${escapeText(event.date)}</div><div class="fact"><small>Location</small>${escapeText(event.location)}</div><div class="fact"><small>Category</small>${escapeText(event.category)}</div><div class="fact"><small>Access</small>Community supported</div></div><p class="detail-copy">${escapeText(event.description)}</p><a class="button" href="registration-placeholder.html?id=${event.id}">Register interest</a></div></div>`;
  } catch {
    showState(
      root,
      "Event not found. Return to search and choose another event.",
    );
  }
});
