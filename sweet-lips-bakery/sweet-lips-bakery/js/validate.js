/* Sweet Lips Bakery — shared client-side form validation.
   Combines HTML5 constraint attributes (required, minlength, pattern, min, max,
   type) with JavaScript that shows friendly, accessible error messages. */
const Validate = (() => {
  "use strict";

  function labelFor(el) {
    const label = el.form.querySelector(`label[for="${el.id}"]`);
    if (!label) return "this field";
    return label.textContent.replace("*", "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function messageFor(el) {
    const v = el.validity;
    const name = labelFor(el);
    if (v.valueMissing) {
      return el.tagName === "SELECT" ? `Please choose an option for ${name}.` : `Please fill in ${name}.`;
    }
    if (v.typeMismatch && el.type === "email") return "Please enter a valid email address, e.g. name@example.com.";
    if (v.patternMismatch && el.type === "tel") return "Please enter a valid South African number, e.g. 082 311 3458 or +27 82 311 3458.";
    if (v.patternMismatch) return `Please match the requested format for ${name}.`;
    if (v.tooShort) return `Please enter at least ${el.minLength} characters (you have entered ${el.value.length}).`;
    if (v.tooLong) return `Please use no more than ${el.maxLength} characters.`;
    if (v.rangeUnderflow) {
      return el.type === "date" ? "Please choose today's date or a date in the future." : `The minimum value is ${el.min}.`;
    }
    if (v.rangeOverflow) return `The maximum value is ${el.max}.`;
    if (v.badInput || v.stepMismatch) return "Please enter a whole number.";
    return "Please check this field.";
  }

  function setError(el, message) {
    const wrapper = el.closest(".field");
    const output = document.getElementById(`${el.id}-error`);
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
    if (output) output.textContent = message || "";
    if (message) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }

  function checkField(el) {
    if (el.disabled || el.closest("[hidden]")) {
      setError(el, "");
      return true;
    }
    // Treat whitespace-only text as empty
    const isText = el.tagName === "TEXTAREA" || ["text", "email", "tel", "search"].includes(el.type);
    if (isText && el.required && el.value.trim() === "") {
      setError(el, `Please fill in ${labelFor(el)}.`);
      return false;
    }
    if (!el.checkValidity()) {
      setError(el, messageFor(el));
      return false;
    }
    setError(el, "");
    return true;
  }

  function fields(form) {
    return Array.from(form.elements).filter((el) => ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName) && el.type !== "checkbox" && el.type !== "submit");
  }

  function checkForm(form) {
    let firstInvalid = null;
    fields(form).forEach((el) => {
      if (!checkField(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // Validate each field when the user leaves it, then re-check as they type
  function attachLive(form) {
    fields(form).forEach((el) => {
      el.addEventListener("blur", () => { if (el.value !== "" || el.required) checkField(el); });
      const recheck = () => { if (el.getAttribute("aria-invalid") === "true") checkField(el); };
      el.addEventListener("input", recheck);
      el.addEventListener("change", recheck);
    });
  }

  function attachCounter(textarea, counter) {
    if (!textarea || !counter) return;
    const update = () => { counter.textContent = String(textarea.value.length); };
    textarea.addEventListener("input", update);
    update();
  }

  return { checkForm, checkField, attachLive, attachCounter };
})();
