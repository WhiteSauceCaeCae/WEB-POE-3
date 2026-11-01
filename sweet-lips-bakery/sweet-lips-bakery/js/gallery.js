/* Sweet Lips Bakery — gallery with lightbox (native <dialog>). */
(() => {
  "use strict";

  const gallery = document.querySelector("[data-gallery]");
  const box = document.getElementById("lightbox");
  if (!gallery || !box || typeof box.showModal !== "function") return;

  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const items = Array.from(gallery.querySelectorAll(".gallery-item"));
  let current = 0;
  let opener = null;

  const show = (index) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    img.src = item.dataset.full;
    img.alt = item.dataset.alt;
    caption.textContent = `${current + 1} of ${items.length}: ${item.dataset.alt}`;
  };

  gallery.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    opener = item;
    show(items.indexOf(item));
    box.showModal();
  });

  box.addEventListener("click", (e) => {
    // Close on backdrop click or close button
    if (e.target === box || e.target.closest("[data-lightbox-close]")) box.close();
    if (e.target.closest("[data-lightbox-prev]")) show(current - 1);
    if (e.target.closest("[data-lightbox-next]")) show(current + 1);
  });

  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  box.addEventListener("close", () => {
    if (opener) opener.focus();
  });
})();
