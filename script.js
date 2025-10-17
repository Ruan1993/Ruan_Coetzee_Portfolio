tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Blue-500
        secondary: "#10B981", // Emerald-500
        "dark-bg": "#0A0A0A", // Near-black for main background
        "card-bg": "#18181B", // Zinc-800 for cards
      },
    },
  },
};

// Initialize Vanta.js
VANTA.NET({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  color: 0x3b82f6, // Primary color
  backgroundColor: 0x0a0a0a, // Dark background
  points: 10.0,
  maxDistance: 20.0,
  spacing: 15.0,
});

// Initialize Feather icons
feather.replace();

// Mobile Menu Toggle
document
  .getElementById("menu-toggle")
  .addEventListener("click", function () {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("hidden");
  });

// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById("scroll-progress").style.width =
    scrollPercent + "%";
});

// --- Magnetic Button Effect (New Interactivity) ---
const magnetize = (target, strength = 0.5) => {
  document.addEventListener("mousemove", (e) => {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Simple Euclidean distance
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 200; // Affect buttons within 200px

    if (distance < maxDistance) {
      const power = 1 - distance / maxDistance;
      const translateX = deltaX * strength * power;
      const translateY = deltaY * strength * power;

      target.style.transform = `translate(${translateX}px, ${translateY}px)`;
    } else {
      target.style.transform = `translate(0px, 0px)`;
    }
  });

  // Reset position when mouse leaves the document (or window focus changes)
  document.addEventListener("mouseleave", () => {
    target.style.transform = `translate(0px, 0px)`;
  });
};

// Apply magnetic effect to your main hero buttons
document.querySelectorAll("a.magnetic-button").forEach((button) => {
  magnetize(button, 0.4); // Adjust strength here (0.4 is subtle/modern)
});

// --- Cursor Trail Effect (Subtle Interactivity) ---
document.addEventListener("mousemove", (e) => {
  const cursorTrail = document.getElementById("cursor-trail");
  if (cursorTrail) {
    // Throttle this or use CSS transitions for smoothness
    cursorTrail.style.left = `${e.clientX}px`;
    cursorTrail.style.top = `${e.clientY + window.scrollY}px`;
  }
});

// --- Ripple Effect JS (Retained) ---
document
  .querySelectorAll("button, a.magnetic-button")
  .forEach((button) => {
    // Ensure the button/link has the relative style for the ripple to position correctly
    if (window.getComputedStyle(button).position === "static") {
      button.style.position = "relative";
    }
    button.style.overflow = "hidden";

    button.addEventListener("click", function (e) {
      // Existing ripple logic
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      this.appendChild(ripple);

      const rect = e.target
        .closest("button, a.magnetic-button")
        .getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Adjust size for a better effect
      const size = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });