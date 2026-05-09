const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const reservationForm = document.querySelector("[data-reservation-form]");
const guardianField = document.querySelector("[data-guardian-field]");
const participantOptions = document.querySelectorAll("[data-participant-option]");
const formConfirmation = document.querySelector("[data-form-confirmation]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");

    const href = link.getAttribute("href");
    const target = href && href.startsWith("#") ? document.querySelector(href) : null;
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

const syncGuardianField = () => {
  if (!guardianField) {
    return;
  }

  const selected = document.querySelector("[data-participant-option]:checked");
  const needsGuardian = selected && selected.value !== "adulte";
  guardianField.classList.toggle("is-hidden", !needsGuardian);
  guardianField.querySelector("input").required = needsGuardian;
};

participantOptions.forEach((option) => {
  option.addEventListener("change", syncGuardianField);
});

syncGuardianField();

if (reservationForm) {
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formConfirmation.textContent = "Merci, votre demande est prête à être confirmée par le studio.";
    reservationForm.reset();
    syncGuardianField();
  });
}
