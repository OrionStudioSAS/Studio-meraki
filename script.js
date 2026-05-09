// ── Hero video autoplay fallback (Safari) ────────────────────
const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.play().catch(() => {});
}

// ── Lenis smooth scroll ───────────────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ── Ancres nav → scroll Lenis ────────────────────────────────
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
      lenis.scrollTo(target, { offset: -80 });
    }
  });
});

// ── Reveal on scroll ─────────────────────────────────────────
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

// ── Formulaire réservation ───────────────────────────────────
const syncGuardianField = () => {
  if (!guardianField) return;
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
