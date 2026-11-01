/* Sweet Lips Bakery — dynamic menu.
   Loads data/menu.json with fetch (AJAX), builds the cards with DOM methods,
   and supports search, category filter, dietary filter and sorting. */
(() => {
  "use strict";

  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  const searchInput = document.getElementById("menu-search");
  const dietSelect = document.getElementById("menu-diet");
  const sortSelect = document.getElementById("menu-sort");
  const categoryButtons = document.getElementById("category-buttons");
  const count = document.getElementById("results-count");
  const dialog = document.getElementById("item-dialog");

  const state = { items: [], query: "", category: "all", diet: "all", sort: "name" };
  const rand = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });

  const formatPrice = (item) => (item.unit === "from" ? `From ${rand.format(item.price)}` : `${rand.format(item.price)} ${item.unit}`);

  function createCard(item) {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.alt;
    img.width = 600;
    img.height = 450;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const badges = document.createElement("p");
    const catBadge = document.createElement("span");
    catBadge.className = "badge";
    catBadge.textContent = item.category;
    badges.appendChild(catBadge);
    item.dietary.forEach((d) => {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = d;
      badges.appendChild(b);
    });

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(item);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--small btn--ghost";
    btn.dataset.itemId = item.id;
    btn.textContent = "View details";

    body.append(title, badges, price, btn);
    card.append(img, body);
    return card;
  }

  function getVisibleItems() {
    const q = state.query.trim().toLowerCase();
    let list = state.items.filter((item) => {
      const matchesText = !q || `${item.name} ${item.description} ${item.category} ${item.dietary.join(" ")}`.toLowerCase().includes(q);
      const matchesCategory = state.category === "all" || item.category === state.category;
      const matchesDiet = state.diet === "all" || item.dietary.includes(state.diet);
      return matchesText && matchesCategory && matchesDiet;
    });
    const sorters = {
      name: (a, b) => a.name.localeCompare(b.name),
      "price-asc": (a, b) => a.price - b.price || a.name.localeCompare(b.name),
      "price-desc": (a, b) => b.price - a.price || a.name.localeCompare(b.name),
    };
    list = list.slice().sort(sorters[state.sort]);
    return list;
  }

  function render() {
    const list = getVisibleItems();
    const fragment = document.createDocumentFragment();
    list.forEach((item) => fragment.appendChild(createCard(item)));
    grid.replaceChildren(fragment);
    count.textContent = list.length
      ? `Showing ${list.length} of ${state.items.length} items`
      : "No items match your search. Try clearing a filter.";
  }

  function openDetails(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item || !dialog || typeof dialog.showModal !== "function") return;
    document.getElementById("item-img").src = item.image;
    document.getElementById("item-img").alt = item.alt;
    document.getElementById("item-title").textContent = item.name;
    document.getElementById("item-desc").textContent = item.description;
    document.getElementById("item-price").textContent = formatPrice(item);
    const badges = document.getElementById("item-badges");
    badges.replaceChildren();
    [item.category, ...item.dietary].forEach((text) => {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = text;
      badges.appendChild(b);
    });
    dialog.showModal();
  }

  // Events (delegation for dynamically created buttons)
  document.getElementById("menu-controls").addEventListener("submit", (e) => e.preventDefault());
  searchInput.addEventListener("input", () => { state.query = searchInput.value; render(); });
  dietSelect.addEventListener("change", () => { state.diet = dietSelect.value; render(); });
  sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; render(); });

  categoryButtons.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    state.category = btn.dataset.category;
    categoryButtons.querySelectorAll(".filter-btn").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    render();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-item-id]");
    if (btn) openDetails(btn.dataset.itemId);
  });

  if (dialog) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog || e.target.closest("[data-dialog-close]")) dialog.close();
    });
  }

  // Load the menu data asynchronously
  fetch("data/menu.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((items) => {
      state.items = items;
      render();
    })
    .catch(() => {
      count.textContent = "Sorry, the menu could not be loaded. Please refresh the page or contact us for a price list.";
    });
})();
