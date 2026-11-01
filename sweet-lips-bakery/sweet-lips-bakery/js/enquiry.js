/* Sweet Lips Bakery — enquiry form.
   Validates the input, loads pricing and availability rules with fetch (AJAX)
   and presents the user with a cost estimate and an availability response. */
(() => {
  "use strict";

  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const orderType = $("orderType");
  const cakeSizeWrap = $("cakeSize-wrap");
  const cakeSize = $("cakeSize");
  const qtyWrap = $("quantity-wrap");
  const qty = $("quantity");
  const qtyLabel = $("quantity-label");
  const eventDate = $("eventDate");
  const result = $("enquiry-result");
  const submitBtn = form.querySelector('button[type="submit"]');

  const rand = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });
  const PHONE_TEL = "+27823113458";

  const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  eventDate.min = toISO(new Date());

  function daysUntil(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((new Date(y, m - 1, d) - start) / 86400000);
  }

  function updateFields() {
    const t = orderType.value;
    cakeSizeWrap.hidden = t !== "cake";
    cakeSize.required = t === "cake";
    const needsQty = t === "cupcakes" || t === "catering";
    qtyWrap.hidden = !needsQty;
    qty.required = needsQty;
    if (t === "cupcakes") {
      qty.min = "1";
      qty.max = "20";
      qtyLabel.firstChild.textContent = "Number of boxes (12 cupcakes each) ";
    } else if (t === "catering") {
      qty.min = "20";
      qty.max = "300";
      qtyLabel.firstChild.textContent = "Number of guests (minimum 20) ";
    }
  }

  const fetchJSON = (url) =>
    fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });

  function checkAvailability(dateStr, rules) {
    const days = daysUntil(dateStr);
    if (rules.fullyBooked.includes(dateStr)) {
      return { ok: false, message: "Sorry, we are fully booked on that date. Please choose another date or call us to join the waiting list." };
    }
    if (days < rules.minNoticeDays) {
      return { ok: false, message: `We need at least ${rules.minNoticeDays} days' notice for custom orders. Please choose a later date, or call us to see if we can help.` };
    }
    return { ok: true, days, message: "Good news! We have availability on your chosen date." };
  }

  function buildEstimate(data, pricing, rules, days) {
    const lines = [];
    const t = data.orderType;
    let base = 0;

    if (t === "cake") {
      const size = pricing.cakeSizes[data.cakeSize];
      base = size.price;
      lines.push([`Custom cake: ${size.label}`, base]);
    } else if (t === "cupcakes") {
      const boxes = Number(data.quantity);
      base = boxes * pricing.cupcakeBoxPrice;
      lines.push([`${boxes} box${boxes > 1 ? "es" : ""} of 12 gourmet cupcakes (${boxes * 12} cupcakes)`, base]);
    } else {
      const guests = Number(data.quantity);
      base = guests * pricing.cateringPerGuest;
      lines.push([`Event dessert catering for ${guests} guests`, base]);
    }

    const flavourExtra = pricing.flavourSurcharge[data.flavour] || 0;
    if (flavourExtra && t !== "catering") {
      const multiplier = t === "cupcakes" ? Number(data.quantity) : 1;
      lines.push(["Premium flavour", flavourExtra * multiplier]);
    }
    if (data.dietary !== "none") {
      lines.push([`${data.dietary === "vegan" ? "Vegan" : "Gluten-free"} recipe (+${Math.round(pricing.dietarySurchargeRate * 100)}%)`, Math.round(base * pricing.dietarySurchargeRate)]);
    }
    if (days < rules.rushNoticeDays) {
      lines.push([`Short-notice fee (+${Math.round(pricing.rushRate * 100)}%)`, Math.round(base * pricing.rushRate)]);
    }
    if (data.delivery) lines.push(["Delivery in Greater Cape Town", pricing.deliveryFee]);

    const total = lines.reduce((sum, line) => sum + line[1], 0);
    return { lines, total };
  }

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function render(data, availability, estimate) {
    result.replaceChildren();
    result.classList.toggle("is-warning", !availability.ok);
    result.appendChild(el("h2", availability.ok ? `Thank you, ${data.name.split(" ")[0]}!` : "Date not available"));
    result.appendChild(el("p", availability.message));

    if (availability.ok && estimate) {
      const list = el("ul", undefined, "breakdown");
      estimate.lines.forEach(([label, amount]) => {
        const li = document.createElement("li");
        li.append(el("span", label), el("span", rand.format(amount)));
        list.appendChild(li);
      });
      const totalLi = el("li", undefined, "total");
      totalLi.append(el("span", "Estimated total"), el("span", rand.format(estimate.total)));
      list.appendChild(totalLi);
      result.appendChild(list);
      result.appendChild(el("p", "This is an estimate only. Our team will confirm the final quote and design with you using the contact details you gave us.", "hint"));
    }

    const call = el("a", "Call 082 311 3458", "btn");
    call.href = `tel:${PHONE_TEL}`;
    result.appendChild(call);
    result.hidden = false;
    result.focus();
  }

  orderType.addEventListener("change", updateFields);
  Validate.attachLive(form);
  Validate.attachCounter($("details"), $("details-count"));
  updateFields();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!Validate.checkForm(form)) return;

    const data = Object.fromEntries(new FormData(form).entries());
    data.delivery = form.elements.delivery.checked;

    submitBtn.disabled = true;
    submitBtn.textContent = "Checking availability...";
    try {
      const [pricing, rules] = await Promise.all([fetchJSON("data/pricing.json"), fetchJSON("data/availability.json")]);
      const availability = checkAvailability(data.eventDate, rules);
      const estimate = availability.ok ? buildEstimate(data, pricing, rules, availability.days) : null;
      render(data, availability, estimate);
    } catch (err) {
      result.replaceChildren(el("p", "Sorry, we could not calculate your estimate right now. Please try again, or call us on 082 311 3458."));
      result.classList.add("is-warning");
      result.hidden = false;
      result.focus();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Get my estimate";
    }
  });
})();
