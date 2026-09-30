document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#search-form");
  const grid = document.querySelector("#results");
  const count = document.querySelector("#result-count");
  const load = async () => {
    showState(grid, "Loading forest events…");
    const params = new URLSearchParams(new FormData(form));
    try {
      const events = await api(`/api/events/search?${params}`);
      count.textContent = `${events.length} events found`;
      grid.innerHTML = events.length
        ? events.map(card).join("")
        : '<div class="state" role="status"><img class="state-illustration" src="/assets/empty-state.svg" alt="" width="160" height="120"><p>No events match your filters. Try another keyword or category.</p></div>';
    } catch {
      grid.innerHTML =
        '<div class="empty" role="alert">Search unavailable. <button class="button" id="retry">Retry</button></div>';
      document.querySelector("#retry").onclick = load;
    }
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    load();
  });
  load();
});
