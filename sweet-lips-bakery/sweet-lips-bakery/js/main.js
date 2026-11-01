/* Sweet Lips Bakery — shared interactions: nav toggle, footer year,
   scroll-reveal animations, accessible tabs and accordion. */
(() => {
  "use strict";

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Mobile navigation toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Scroll-reveal animation using IntersectionObserver
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Accordion (one panel open at a time, event delegation)
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    accordion.addEventListener("click", (e) => {
      const trigger = e.target.closest(".accordion-trigger");
      if (!trigger) return;
      const wasOpen = trigger.getAttribute("aria-expanded") === "true";
      accordion.querySelectorAll(".accordion-trigger").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        document.getElementById(btn.getAttribute("aria-controls")).hidden = true;
      });
      if (!wasOpen) {
        trigger.setAttribute("aria-expanded", "true");
        document.getElementById(trigger.getAttribute("aria-controls")).hidden = false;
      }
    });
  });

  // Tabs (click + arrow-key navigation)
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const select = (tab) => {
      tabButtons.forEach((t) => {
        const active = t === tab;
        t.setAttribute("aria-selected", String(active));
        t.tabIndex = active ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
      });
    };
    tabButtons.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight") next = tabButtons[(index + 1) % tabButtons.length];
        if (e.key === "ArrowLeft") next = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
        if (e.key === "Home") next = tabButtons[0];
        if (e.key === "End") next = tabButtons[tabButtons.length - 1];
        if (next) {
          e.preventDefault();
          select(next);
          next.focus();
        }
      });
    });
  });
})();
