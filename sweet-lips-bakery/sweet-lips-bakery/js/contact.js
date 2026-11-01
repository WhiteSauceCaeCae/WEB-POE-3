/* Sweet Lips Bakery — contact form.
   Validates the input, compiles it into an email and lets the visitor send it
   to the recipient defined below. If FORM_ENDPOINT is set (e.g. a Formspree URL)
   the message is also submitted asynchronously with fetch (AJAX). */
(() => {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  // Recipient of the compiled email. Change to the bakery's real address.
  const RECIPIENT = "orders@sweetlipsbakery.co.za";
  // Optional AJAX endpoint, e.g. "https://formspree.io/f/yourFormId". Leave empty to use the email flow only.
  const FORM_ENDPOINT = "";

  const result = document.getElementById("contact-result");
  const submitBtn = form.querySelector('button[type="submit"]');

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function compose(data) {
    const subject = `Website message: ${data.type} from ${data.name}`;
    const body = [
      "Hi Sweet Lips Bakery,",
      "",
      data.message.trim(),
      "",
      "--",
      `Name: ${data.name.trim()}`,
      `Email: ${data.email.trim()}`,
      `Phone: ${data.phone.trim() || "not provided"}`,
      `Message type: ${data.type}`,
    ].join("\r\n");
    const href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { subject, body, href };
  }

  function showEmail(email, intro) {
    result.replaceChildren();
    result.classList.remove("is-warning");
    result.appendChild(el("h2", "Your message is ready"));
    result.appendChild(el("p", intro));
    result.appendChild(el("p", `To: ${RECIPIENT}`, "hint"));
    result.appendChild(el("p", `Subject: ${email.subject}`, "hint"));
    result.appendChild(el("pre", email.body, "email-preview"));
    const send = el("a", "Send email", "btn");
    send.href = email.href;
    result.appendChild(send);
    result.hidden = false;
    result.focus();
  }

  function showSent() {
    result.replaceChildren(
      el("h2", "Message sent!"),
      el("p", "Thank you for getting in touch. We will reply to the email address you provided as soon as we can.")
    );
    result.classList.remove("is-warning");
    result.hidden = false;
    result.focus();
  }

  Validate.attachLive(form);
  Validate.attachCounter(document.getElementById("c-message"), document.getElementById("c-message-count"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!Validate.checkForm(form)) return;

    const data = Object.fromEntries(new FormData(form).entries());
    data.phone = data.phone || "";
    const email = compose(data);

    if (!FORM_ENDPOINT) {
      showEmail(email, "Please check your message below, then choose Send email to open it in your email app.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      showSent();
    } catch (err) {
      showEmail(email, "We could not send your message automatically. Please use Send email to send it from your email app instead.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Review & send";
    }
  });
})();
