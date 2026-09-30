document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("#featured-events");
  try {
    const events = await api("/api/events/featured");
    grid.innerHTML = events.map(card).join("");
  } catch {
    showState(grid, "Events could not load. Please try again.");
  }
});
