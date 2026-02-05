/* =========================================================
   CONNECT-MAIL.JS 
   ========================================================= */

import { t, onLanguageChange } from "../ui/i18n.js";

export function initConnectMail() {

  const form = document.querySelector(".connect-form");
  if (!form || !window.emailjs) return;

  const feedback  = form.querySelector(".form-feedback");
  const submitBtn = form.querySelector(".form-submit");

  const fields = {
    name:    form.querySelector('[name="name"]'),
    email:   form.querySelector('[name="email"]'),
    message: form.querySelector('[name="message"]'),
  };

  if (!feedback || !submitBtn || Object.values(fields).some(f => !f)) return;

  emailjs.init("lVqMAbSHdWZlz4mUl");

  /* =========================================================
     ESTADO INTERNO
     ========================================================= */

  let lastFeedbackKey = null;
  let isSubmitting = false;

  /* =========================================================
     UI HELPERS
     ========================================================= */

  function showFeedback(key, type) {
    lastFeedbackKey = key;
    feedback.textContent = t(key);
    feedback.className = `form-feedback ${type} is-visible`;
  }

  function clearFeedback() {
    lastFeedbackKey = null;
    feedback.textContent = "";
    feedback.className = "form-feedback";
  }

  function setFieldValidity(field, isValid) {
    field.setAttribute("aria-invalid", String(!isValid));
  }

  function resetFieldValidity() {
    Object.values(fields).forEach(field =>
      setFieldValidity(field, true)
    );
  }

  function setLoadingState(loading) {
    isSubmitting = loading;
    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-busy", String(loading));
    submitBtn.textContent = loading
      ? t("connect.form.submit.loading")
      : t("connect.form.submit");
  }

  /* =========================================================
     VALIDADORES
     ========================================================= */

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidName(value) {
    if (value.length < 2 || value.length > 60) return false;
    return /^[\p{L}\s'-]+$/u.test(value);
  }

  function isValidMessage(value) {
    return value.length >= 5 && value.length <= 1000;
  }

  /* =========================================================
     VALIDACIÓN GENERAL
     ========================================================= */

  function validate(params) {
    let valid = true;

    if (!params.name || !isValidName(params.name)) {
      setFieldValidity(fields.name, false);
      valid = false;
    }

    if (!params.email || !isValidEmail(params.email)) {
      setFieldValidity(fields.email, false);
      valid = false;
    }

    if (!params.message || !isValidMessage(params.message)) {
      setFieldValidity(fields.message, false);
      valid = false;
    }

    return valid;
  }

  /* =========================================================
     SUBMIT
     ========================================================= */

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearFeedback();
    resetFieldValidity();

    const params = {
      name:    fields.name.value.trim(),
      email:   fields.email.value.trim(),
      message: fields.message.value.trim(),
    };

    if (!validate(params)) {
      showFeedback("connect.feedback.invalid", "error");
      return;
    }

    setLoadingState(true);

    emailjs
      .send("service_qtj5rkm", "template_qfaomfd", params)
      .then(() => {
        showFeedback("connect.feedback.success", "success");
        form.reset();

        setTimeout(() => {
          clearFeedback();
          setLoadingState(false);
        }, 2500);
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        showFeedback("connect.feedback.error", "error");
        setLoadingState(false);
      });
  });

  /* =========================================================
     SINCRONIZACIÓN CON I18N
     ========================================================= */

  onLanguageChange(() => {
    if (!isSubmitting) {
      submitBtn.textContent = t("connect.form.submit");
    }

    if (lastFeedbackKey) {
      feedback.textContent = t(lastFeedbackKey);
    }
  });

}
