document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#search-form");
  const grid = document.querySelector("#results");
  const count = document.querySelector("#result-count");
  const category = form.elements.category;
  const incoming = new URLSearchParams(location.search);  const initialize = async () => {
    category.disabled = true;
    category.replaceChildren(new Option("Loading categories…", ""));
    try {
      const categories = await api("/api/categories");
      category.replaceChildren(new Option("All categories", ""));
      categories.forEach((name) => category.add(new Option(name, name)));
      const requestedCategory = incoming.get("category");
      if (requestedCategory && categories.includes(requestedCategory)) category.value = requestedCategory;
      category.disabled = false;
      ["keyword", "date", "location"].forEach((name) => {
        const value = incoming.get(name);
        if (value && form.elements[name]) form.elements[name].value = value;
      });
      await load();
    } catch {
      category.replaceChildren(new Option("Categories unavailable", ""));
      const message = document.createElement("div");
      message.className = "state";
      message.setAttribute("role", "alert");
      message.textContent = "Categories could not load. Check the connection and try again. ";
      const retry = document.createElement("button");
      retry.className = "button secondary";
      retry.type = "button";
      retry.textContent = "Retry categories";
      retry.addEventListener("click", initialize);
      grid.replaceChildren(message, retry);
      category.disabled = true;
    }
  };  const load = async () => {
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
  form.addEventListener("reset", () => window.setTimeout(load, 0));
  initialize();
});
