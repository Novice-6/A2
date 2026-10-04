document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  const root = document.querySelector("#event-detail");
  const label = "A";
  if (!id) return showState(root, "Event ID is missing.");

  // A2 does not submit registrations yet, so the Register button opens this
  // modal instead of navigating to a separate page.
  const dialog = document.createElement("dialog");
  dialog.className = "modal";
  dialog.innerHTML = `<p>This feature is currently under construction.</p><button type="button" class="button" data-close>Close</button>`;
  document.body.appendChild(dialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.hasAttribute("data-close")) {
      dialog.close();
    }
  });

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
    const suspended = event.status === "suspended";
    const register = suspended
      ? `<button class="button" type="button" disabled aria-disabled="true">Register interest</button><p class="detail-copy">Registration is paused while this event is suspended.</p>`
      : `<button class="button" type="button" id="register-cta">Register interest</button>`;

    // Goal vs progress for the fundraising target of this event.
    const goal = Number(event.goalAmount) || 0;
    const raised = Number(event.raisedAmount) || 0;
    const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
    const progress =
      goal > 0
        ? `<h2>Goal and progress</h2><div class="progress" role="progressbar" aria-label="Fundraising progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span class="progress-bar" style="width:${percent}%"></span></div><p class="detail-copy">Raised $${raised.toLocaleString()} of the $${goal.toLocaleString()} goal (${percent}%).</p>`
        : `<h2>Goal and progress</h2><p class="detail-copy">This event does not have a fundraising target.</p>`;

    const time = event.time ? String(event.time).slice(0, 5) : "To be confirmed";
    root.innerHTML = `<div class="event-layout"><div><div class="placeholder-media">${image(event.image, event.title)}</div><div class="gallery">${gallery}</div></div><div><span class="status">${escapeText(event.status)}</span><h1>${escapeText(event.title)}</h1><div class="facts"><div class="fact"><small>Date</small>${escapeText(event.date)}</div><div class="fact"><small>Time</small>${escapeText(time)}</div><div class="fact"><small>Location</small>${escapeText(event.location)}</div><div class="fact"><small>Category</small>${escapeText(event.category)}</div><div class="fact"><small>Ticket price</small>${escapeText(event.price)}</div><div class="fact"><small>Access</small>Community supported</div></div><p class="detail-copy">${escapeText(event.description)}</p><h2>Our cause</h2><p class="detail-copy">${escapeText(event.purpose)}</p>${progress}${register}</div></div>`;

    const cta = root.querySelector("#register-cta");
    if (cta) cta.addEventListener("click", () => dialog.showModal());
  } catch {
    showState(
      root,
      "Event not found. Return to search and choose another event.",
    );
  }
});
