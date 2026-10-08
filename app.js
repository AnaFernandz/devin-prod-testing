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

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = "Please fill in all fields with a valid email.";
      status.className = "error";
      return;
    }
    const name = form.elements.name.value.trim();
    status.textContent = "Thanks, " + name + "! Your message was received.";
    status.className = "success";
    form.reset();
  });
})();
