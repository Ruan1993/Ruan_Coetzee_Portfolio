// ------------------------------------------------------------------
// --- Tailwind Configuration (Reference) ---
// ------------------------------------------------------------------
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
        "dark-bg": "#0A0A0A",
        "card-bg": "#18181B",
      },
    },
  },
};

// ------------------------------------------------------------------
// --- DOMContentLoaded: All UI + Form Logic ---
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // --- VANTA.NET Background ---
  // -----------------------------
  VANTA.NET({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x3b82f6,
    backgroundColor: 0x0a0a0a,
    points: 10.0,
    maxDistance: 20.0,
    spacing: 15.0,
  });

  // -----------------------------
  // --- Feather Icons ---
  // -----------------------------
  feather.replace();

  // -----------------------------
  // --- Mobile Menu Toggle ---
  // -----------------------------
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) mobileMenu.classList.toggle("hidden");
    });
  }

  // -----------------------------
  // --- Scroll Progress Bar ---
  // -----------------------------
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const progress = document.getElementById("scroll-progress");
    if (progress) progress.style.width = scrollPercent + "%";
  });

  // -----------------------------
  // --- Modal Setup Function ---
  // -----------------------------
  const setupModal = (openBtnId, closeBtnId, overlayId, contentId) => {
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const modalOverlay = document.getElementById(overlayId);
    const modalContent = document.getElementById(contentId);
    if (!openBtn || !modalOverlay) return;

    const showModal = () => {
      modalOverlay.classList.remove("hidden");
      modalOverlay.style.display = "flex";
      void modalOverlay.offsetWidth;
      modalOverlay.style.pointerEvents = "auto";
      modalOverlay.classList.add("opacity-100");
      modalContent.classList.remove("scale-95");
      modalContent.classList.add("scale-100");
      document.body.style.overflow = "hidden";
    };

    const hideModal = () => {
      modalOverlay.style.pointerEvents = "none";
      modalOverlay.classList.remove("opacity-100");
      modalContent.classList.remove("scale-100");
      modalContent.classList.add("scale-95");
      setTimeout(() => {
        modalOverlay.classList.add("hidden");
        modalOverlay.style.display = "none";
        document.body.style.overflow = "";
        modalOverlay.style.pointerEvents = "";
      }, 300);
    };

    openBtn.addEventListener("click", showModal);
    if (closeBtn) closeBtn.addEventListener("click", hideModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) hideModal();
    });
  };

  // Example modals
  setupModal(
    "open-ai-courses-modal",
    "close-ai-courses-modal",
    "ai-courses-modal-overlay",
    "ai-courses-modal-content"
  );
  setupModal(
    "open-web-sql-courses-modal",
    "close-web-sql-courses-modal",
    "web-sql-courses-modal-overlay",
    "web-sql-courses-modal-content"
  );

  // -----------------------------
  // --- Tabs Logic ---
  // -----------------------------
  const tabs = document.querySelectorAll("[data-tab-target]");
  const tabContents = document.querySelectorAll("[data-tab-content]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.tabTarget);
      tabContents.forEach((content) => content.classList.remove("active"));
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      if (target) target.classList.add("active");
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      feather.replace();
    });
  });

  // -----------------------------
  // --- Back To Top Button ---
  // -----------------------------
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) backToTopBtn.classList.add("show");
      else backToTopBtn.classList.remove("show");
    };
    window.addEventListener("scroll", toggleBackToTop);
    toggleBackToTop();
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -----------------------------
  // --- Custom Cursor + Trail ---
  // -----------------------------
  const cursorDot = document.getElementById("custom-cursor-dot");
  const cursorTrail = document.getElementById("cursor-trail");
  let mouseX = 0,
    mouseY = 0,
    currentTrailX = 0,
    currentTrailY = 0,
    easing = 0.05;

  const createParticles = (x, y) => {
    const numParticles = 25;
    const colors = ["#ffffff", "#3B82F6", "#60A5FA", "#93C5FD"];
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("div");
      particle.classList.add("click-particle");
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 4 + 1;
      particle.style.width = particle.style.height = `${size}px`;
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 80 + 30;
      const duration = Math.random() * 0.4 + 0.3;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;
      setTimeout(() => {
        particle.style.transition = `transform ${duration}s cubic-bezier(0.2,0.8,0.4,1), opacity ${duration}s ease-out`;
        particle.style.transform = `translate(${targetX - x}px, ${targetY - y}px) rotate(${Math.random()*360}deg) scale(0.1)`;
        particle.style.opacity = "0";
      }, 10);
      setTimeout(() => particle.remove(), duration * 1000 + 100);
      document.body.appendChild(particle);
    }
  };

  if (cursorDot && cursorTrail) {
    currentTrailX = mouseX;
    currentTrailY = mouseY;
    const updateCursor = () => {
      cursorDot.style.transform = `translate3d(${mouseX - 8}px, ${mouseY - 8}px, 0)`;
      currentTrailX += (mouseX - currentTrailX) * easing;
      currentTrailY += (mouseY - currentTrailY) * easing;
      cursorTrail.style.left = `${currentTrailX}px`;
      cursorTrail.style.top = `${currentTrailY}px`;
      requestAnimationFrame(updateCursor);
    };
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target.closest("a, button, .card-hover, .tab-button, [onclick]");
      if (target) {
        cursorDot.classList.add("active");
        cursorTrail.style.width = cursorTrail.style.height = "100px";
      } else {
        cursorDot.classList.remove("active");
        cursorTrail.style.width = cursorTrail.style.height = "70px";
      }
    });
    document.addEventListener("mousedown", (e) => createParticles(e.clientX, e.clientY));
    updateCursor();
  }

  // -----------------------------
  // --- Magnetic Buttons ---
  // -----------------------------
  const magnetize = (target, strength = 0.5) => {
    document.addEventListener("mousemove", (e) => {
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 200;
      if (distance < maxDistance) {
        const power = 1 - distance / maxDistance;
        target.style.transform = `translate(${deltaX * strength * power}px, ${deltaY * strength * power}px)`;
      } else target.style.transform = "translate(0px,0px)";
    });
    target.addEventListener("mouseleave", () => (target.style.transform = "translate(0px,0px)"));
  };
  document.querySelectorAll("a.magnetic-button, button.magnetic-button").forEach((btn) => magnetize(btn, 0.4));

  // -----------------------------
  // --- Ripple Effect (Fixed) ---
  // -----------------------------
  document
    .querySelectorAll(
      "button:not(#toggle-progress-details), a.magnetic-button, button#open-ai-courses-modal, button#open-web-sql-courses-modal"
    )
    .forEach((button) => {
      if (window.getComputedStyle(button).position === "static") button.style.position = "relative";
      button.style.overflow = "hidden";

      button.addEventListener("click", function (e) {
        // Skip form buttons to avoid preventing submit
        if (this.closest("form")) return;

        const href = this.getAttribute("href");
        const target = this.getAttribute("target");
        const isInternalLink = href && href.startsWith("#");
        const isExternalLink = href && target === "_blank";

        if (isInternalLink || isExternalLink || href === null) e.preventDefault();

        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        this.appendChild(ripple);
        const rect = e.target.closest("button, a.magnetic-button").getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;

        setTimeout(() => {
          ripple.remove();
          if (this.tagName === "A" && href && !this.classList.contains("tab-button")) {
            if (isInternalLink) {
              const targetEl = document.querySelector(href);
              if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
            } else if (isExternalLink) window.open(href, "_blank");
          }
        }, 600);
      });
    });

  // -----------------------------
  // --- Formspree Submission ---
  // -----------------------------
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          formStatus.textContent = "✅ Message Sent!";
          formStatus.classList.remove("hidden", "text-red-400");
          formStatus.classList.add("text-green-400");
          contactForm.reset();
        } else {
          formStatus.textContent = "❌ Something went wrong. Please try again.";
          formStatus.classList.remove("hidden");
          formStatus.classList.add("text-red-400");
        }
      } catch (err) {
        formStatus.textContent = "❌ Network error. Please try again.";
        formStatus.classList.remove("hidden");
        formStatus.classList.add("text-red-400");
      }
    });
  }
});
