/* Sweet Lips Bakery — interactive Leaflet map with OpenStreetMap tiles.
   UPDATE: replace SHOP with the bakery's real coordinates once confirmed. */
(() => {
  "use strict";

  const container = document.getElementById("map");
  if (!container || typeof L === "undefined") return;

  const SHOP = [-33.9249, 18.4241]; // Cape Town (placeholder coordinates)
  const DELIVERY_RADIUS_M = 15000;

  container.replaceChildren(); // remove the no-JavaScript fallback text

  const map = L.map(container, { scrollWheelZoom: false }).setView(SHOP, 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const popup = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = "Sweet Lips Bakery";
  const hours = document.createElement("div");
  hours.textContent = "Daily 08:00-20:00";
  popup.append(title, hours);

  L.marker(SHOP, { title: "Sweet Lips Bakery" }).addTo(map).bindPopup(popup);

  L.circle(SHOP, {
    radius: DELIVERY_RADIUS_M,
    color: "#d4af37",
    fillColor: "#f4b9c6",
    fillOpacity: 0.25,
  })
    .addTo(map)
    .bindTooltip("Approximate delivery zone");

  // Allow scroll-zoom only after the visitor clicks the map (avoids trapping page scroll)
  map.on("click", () => map.scrollWheelZoom.enable());
  map.on("mouseout", () => map.scrollWheelZoom.disable());
})();
