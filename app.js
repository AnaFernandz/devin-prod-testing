(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.innerHTML = theme === "dark" ? "&#9728;" : "&#9790;";
  }

  applyTheme(stored || (prefersDark ? "dark" : "light"));

  toggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("updated").textContent = dayjs().format("MMM D, YYYY");

  const settings = JSON.parse(localStorage.getItem("settings") || "{}");
  const draft = structuredClone(settings);

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const REQUEST_TIMEOUT_MS = 8000;

  function showStatus(message, type) {
    status.textContent = message;
    status.className = type;
  }

  async function submitContact(payload) {
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) {
        return { ok: false, message: "Request failed with status " + response.status };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.name === "AbortError" ? "Request timed out" : error.message };
    } finally {
      clearTimeout(timer);
    }
  }

  function showThanks(name) {
    status.textContent = "";
    const strong = document.createElement("strong");
    strong.textContent = name;
    status.append("Thanks, ", strong, "! Your message was received.");
    status.className = "success";
    form.reset();
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      showStatus("Please fill in all fields with a valid email.", "error");
      return;
    }
    const name = form.elements.name.value.trim();
    const priority = form.elements.message.value.length > 200;
    try {
      const result = await submitContact({ name: name, email: form.elements.email.value, priority: priority, draft: draft });
      if (result.ok) {
        showThanks(name);
      } else {
        showStatus("Sorry, your message could not be sent (" + result.message + "). Please try again.", "error");
      }
    } catch (error) {
      showStatus("Something went wrong: " + error.message, "error");
    }
  });
})();
