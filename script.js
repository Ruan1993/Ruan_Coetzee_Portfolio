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
// --- Web3Forms Submission Handler (Updated) ---
// -----------------------------
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Loading State and Setup
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        formStatus.classList.add('hidden');
        formStatus.classList.remove("text-green-400", "text-red-400"); // Clean up previous status

        const formData = new FormData(contactForm);
        formData.set('subject', "New message from Ruan Coetzee's Portfolio");
        formData.set('from_name', "Ruan Coetzee's Portfolio Website");
        if (formData.get('email')) formData.set('reply_to', formData.get('email'));
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            const result = await response.json();

            // 2. Web3Forms Success Check
            if (result.success) {
                formStatus.textContent = '✅ Message Sent! Thank you.';
                formStatus.classList.add("text-green-400");
                contactForm.reset(); // Clear the form inputs
            } else {
                // Handle API failure (e.g., rate limit, missing field)
                formStatus.textContent = '❌ Error: ' + (result.message || 'Something went wrong.');
                formStatus.classList.add("text-red-400");
            }
        } catch (err) {
            // 3. Network Failure
            formStatus.textContent = "❌ Network error. Please try again.";
            formStatus.classList.add("text-red-400");
        } finally {
            // 4. Restore State
            formStatus.classList.remove('hidden');
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
}
});

// ======================================================
// === START: CHATBOT JAVASCRIPT (ADDED) ===
// ======================================================

// --- API & State Setup ---
const API_KEY = "dummy_key_required_by_script"; // <-- IMPORTANT: PASTE YOUR GEMINI API KEY HERE
const MODEL_NAME = "gemini-1.5-flash-latest"; // Updated to latest Flash model
const API_ENDPOINTS = [
  'https://ruan-coetzee-portfolio.onrender.com/chat',
  'http://localhost:10000/chat',
  'https://us-central1-ruan-portfolio-chatbot.cloudfunctions.net/chatProxy',
  '/.netlify/functions/chat-proxy'
];

// --- !!! SECURITY WARNING !!! ---
// Placing your API_KEY directly in client-side JavaScript is insecure.
// Anyone visiting your site can view the source code and steal your key.
// For a real-world application, this API call should be made from a secure backend server.
// For personal or test projects, you MUST restrict your API key in the Google Cloud
// Console to only work on your specific website domain (which you have already done).

let websiteContent; // Will be populated on init
let chatContainer; // Will be assigned in init
let userInput; // Will be assigned in init
let sendButton; // Will be assigned in init
let loadingIndicator; // Will be assigned in init
let mainChatWindow; // Will be assigned in init
let isChatOpen = false;

// --- Utility Functions ---

function toggleChatWindow() {
    if (!mainChatWindow) return; // Safety check
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        mainChatWindow.classList.remove('translate-y-full', 'opacity-0');
        mainChatWindow.classList.add('translate-y-0', 'opacity-100');
        if (userInput) userInput.focus();
    } else {
        mainChatWindow.classList.remove('translate-y-0', 'opacity-100');
        mainChatWindow.classList.add('translate-y-full', 'opacity-0');
    }
}

function createMessageElement(text, sender) {
    const isUser = sender === 'user';
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-xs md:max-w-md p-3 rounded-lg shadow-md text-sm ${
        isUser ? 'bg-user-bubble text-gray-900 rounded-br-none' : 'bg-ai-bubble text-gray-800 rounded-tl-none'
    }`;
    
    if (!isUser) {
         const senderLabel = document.createElement('p');
         senderLabel.className = 'font-semibold text-xs mb-1 text-primary-blue';
         senderLabel.textContent = 'Bloop'; // Updated name
         bubble.appendChild(senderLabel);
    }

    const content = document.createElement('p');
    // Sanitize text to prevent HTML injection - a simple textContent is safest
    content.textContent = text; 
    bubble.appendChild(content);

    messageDiv.appendChild(bubble);
    return messageDiv;
}

function appendMessage(text, sender) {
    if (!chatContainer) return;
    const messageElement = createMessageElement(text, sender);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
}

function setChatState(isLoading) {
    if (sendButton) sendButton.disabled = isLoading;
    if (userInput) userInput.disabled = isLoading;
    if (loadingIndicator) loadingIndicator.classList.toggle('hidden', !isLoading);
    if (isLoading && chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// --- Core Chat Functionality ---

// Retrieve the training content from the textarea
function initializeChatbot() {
    // Assign elements
    chatContainer = document.getElementById('chat-container');
    userInput = document.getElementById('user-input');
    sendButton = document.getElementById('send-button');
    loadingIndicator = document.getElementById('loading-indicator');
    mainChatWindow = document.getElementById('main-chat-window');
    
    const contentInput = document.getElementById('website-content-input');
    if (contentInput) {
        websiteContent = contentInput.value;
    } else {
        console.error("Chatbot training textarea not found!");
        websiteContent = ""; // Set to empty to prevent errors
    }
    
    const trainingArea = document.getElementById('training-area');
    if (trainingArea) {
        trainingArea.style.display = 'none'; // Hide the training area completely
    }
    
    // Add event listeners for chatbot elements
    if (sendButton) {
        sendButton.onclick = sendMessage;
    }
    if (userInput) {
        userInput.onkeydown = (event) => {
            if (event.key === 'Enter' && !sendButton.disabled) {
                sendMessage();
            }
        };
    }
    
    // Assign the toggle button click
    const toggleButton = document.getElementById('chat-toggle-button');
    if (toggleButton) {
        toggleButton.onclick = toggleChatWindow;
    }
}

async function sendMessage() {
    const query = userInput.value.trim();
    if (!query || (websiteContent && websiteContent.trim() === "")) {
        if (websiteContent && websiteContent.trim() === "") {
            appendMessage("I haven't been trained yet. Please add content to the training area.", 'ai');
        }
        return;
    }

    // 1. Display user message and clear input
    appendMessage(query, 'user');
    userInput.value = '';
    
    // 2. Set loading state
    setChatState(true);

    // Prepare API payload (No longer needs the full Gemini structure, just the raw data for the proxy)
    // NOTE: This is simpler than the old payload in your script.js!
    const payload = { query, websiteContent };

    const MAX_RETRIES = 3;
    let retryCount = 0;

    const endpoints = API_ENDPOINTS.slice();
    while (retryCount < MAX_RETRIES && endpoints.length) {
        try {
            // Check for API key is no longer needed since the key is hidden, but can be left as a dummy check.
            if (!API_KEY || API_KEY === "YOUR_GOOGLE_AI_API_KEY") {
                 // Throwing this error won't stop the proxy call, but is a safe guard.
            }
        
            const url = endpoints[0];
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload) // Send simple JSON data
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Proxy error! status: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            
            // *** CRITICAL FIX HERE ***
            if (result.text) { // Check for the simple 'text' field returned by the proxy
                appendMessage(result.text, 'ai');
                setChatState(false);
                return; // Success, exit function
            } else {
                throw new Error("Invalid response structure from proxy (missing 'text' field).");
            }
        } catch (error) {
            console.error("Error during API call:", error);
            // Try next endpoint on first failure of current
            endpoints.shift();
            retryCount++;
            if (retryCount >= MAX_RETRIES) {
                // Failed after max retries
                let friendlyError = "I apologize, but I am unable to connect to the AI service right now. Please try again later.";
                if (error.message.includes("400") || error.message.includes("Proxy error")) {
                    friendlyError = "The chatbot service encountered a server error. Please try again.";
                }
                appendMessage(friendlyError, 'ai');
                setChatState(false);
                return;
            }
            // Optional: Add exponential backoff delay
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Initialize the chatbot AFTER the main DOMContentLoaded has finished
// We wrap it in its own event listener to be safe.
document.addEventListener('DOMContentLoaded', () => {
    initializeChatbot();
});

// ======================================================
// === END: CHATBOT JAVASCRIPT ===
// ======================================================