// ------------------------------------------------------------------
// --- Tailwind Configuration (Reference) ---
// ------------------------------------------------------------------
if (typeof window !== "undefined" && window.tailwind) {
  window.tailwind.config = {
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
}

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
const MAX_CONTEXT_CHARS = 12000;
const __cfg = window.ChatbotConfig || {};
const TRAINING_ONLY = !!__cfg.trainingOnly;
const API_ENDPOINTS = [
  ...(__cfg.endpoint ? [__cfg.endpoint] : []),
  ...((Array.isArray(__cfg.fallbackEndpoints) && __cfg.fallbackEndpoints.length) ? __cfg.fallbackEndpoints : [])
];

let websiteContent; // Will be populated on init
let chatContainer; // Will be assigned in init
let userInput; // Will be assigned in init
let sendButton; // Will be assigned in init
let loadingIndicator; // Will be assigned in init
let mainChatWindow; // Will be assigned in init
let isChatOpen = false;
let conversation = [];

// --- Utility Functions ---

function toggleChatWindow() {
    if (!mainChatWindow) return; // Safety check
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        mainChatWindow.classList.remove('translate-y-full', 'opacity-0');
        mainChatWindow.classList.add('translate-y-0', 'opacity-100');
        if (userInput) userInput.focus();
        try {
            const ep = API_ENDPOINTS[0] || '';
            if (ep) {
                const base = ep.endsWith('/chat') ? ep.slice(0, -5) : ep.replace(/\/$/, '');
                const health = base + '/healthz';
                fetch(health, { method: 'GET' });
            }
        } catch (_) {}
        const tip = document.getElementById('chat-tip');
        if (tip) tip.classList.add('hidden');
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
    if (sender === 'user') conversation.push({ role: 'user', content: text });
    if (sender === 'ai') conversation.push({ role: 'assistant', content: text });
}

function setChatState(isLoading) {
    if (sendButton) sendButton.disabled = isLoading;
    if (userInput) userInput.disabled = isLoading;
    if (loadingIndicator) loadingIndicator.classList.toggle('hidden', !isLoading);
    if (isLoading && chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    if (!isLoading && userInput) {
        try { userInput.focus(); } catch (_) {}
    }
}

function normalizeAIText(text) {
    if (!text) return "";
    let t = String(text);
    t = t.replace(/\*\*/g, "");
    t = t.replace(/(^|\n)#{1,6}\s*/g, "$1");
    t = t.replace(/```[\s\S]*?```/g, "");
    t = t.replace(/\r/g, "");
    t = t.replace(/\n{3,}/g, "\n\n");
    t = t.replace(/^\s*\*\s+/gm, "- ");
    t = t.replace(/^\s*-\s+/gm, "- ");
    t = t.replace(/__([^_]+)__/g, "$1");
    t = t.replace(/^\s*Bloop!?\s*/i, "");
    t = t.replace(/\bBloop!?\b:\s*/gi, "");
    return t.trim();
}

function collectWebsiteContent() {
    const acc = [];
    const exclude = document.getElementById('chatbot-widget-container');
    const nodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, .project-card'));
    for (const el of nodes) {
        if (exclude && exclude.contains(el)) continue;
        const txt = (el.innerText || '').trim();
        if (txt && txt.length > 2) acc.push(txt);
    }
    const joined = acc.join('\n');
    return joined;
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
    let raw = "";
    if (contentInput) { raw = contentInput.value || ""; }
    const scraped = TRAINING_ONLY ? "" : collectWebsiteContent();
    const combined = [raw, scraped].filter(Boolean).join('\n\n');
    websiteContent = combined.slice(0, MAX_CONTEXT_CHARS);
    
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
    const closeButton = document.getElementById('chat-close-button');
    if (closeButton) {
        closeButton.onclick = toggleChatWindow;
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
    
    const ql = query.toLowerCase();
    const localMap = (
        () => {
            if (/\b(hi|hello|hey|good\s*morning|good\s*evening)\b/.test(ql)) return "Hi! How can I help you today?";
            if (/\b(how\s*are\s*you)\b/.test(ql)) return "I'm doing well and ready to help. What would you like to know?";
            if (/\b(who\s*are\s*you|what\s*are\s*you)\b/.test(ql)) return "I'm the website assistant for Ruan Coetzee. Ask me about skills, projects, or how to get in touch.";
            if (/\b(thank\s*you|thanks)\b/.test(ql)) return "You're welcome! Anything else I can help with?";
            if (/\b(what\s*can\s*you\s*do)\b/.test(ql)) return "I can answer questions about Ruan's background, skills, services, and contact details.";
            return null;
        }
    )();
    if (localMap) {
        appendMessage(localMap, 'ai');
        setChatState(false);
        return;
    }

    // Prepare API payload (No longer needs the full Gemini structure, just the raw data for the proxy)
    // NOTE: This is simpler than the old payload in your script.js!
    const styleEl = document.getElementById('answer-style');
    const style = styleEl && styleEl.value ? styleEl.value : 'concise';
    const history = conversation.slice(-6);
    const payload = { query, websiteContent, style, history };

    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError = null;

    const endpoints = API_ENDPOINTS.slice();
    while (retryCount < MAX_RETRIES && endpoints.length) {
        try {
            const url = endpoints[0];
            const controller = new AbortController();
            const timeoutMs = 45000;
            const t = setTimeout(() => controller.abort(), timeoutMs);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal,
                mode: 'cors',
                credentials: 'omit'
            });
            clearTimeout(t);

            if (!response.ok) {
                let errMsg = `Proxy error! status: ${response.status} ${response.statusText}`;
                const raw = await response.text();
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed && parsed.error) {
                            errMsg += ` - ${parsed.error}`;
                        } else {
                            errMsg += ` - ${raw}`;
                        }
                    } catch (_) {
                        errMsg += ` - ${raw}`;
                    }
                }
                throw new Error(errMsg);
            }

            const result = await response.json();
            
            // *** CRITICAL FIX HERE ***
            if (result.text) {
                const clean = normalizeAIText(result.text);
                appendMessage(clean, 'ai');
                setChatState(false);
                return; // Success, exit function
            } else {
                throw new Error("Invalid response structure from proxy (missing 'text' field).");
            }
        } catch (error) {
            console.error("Error during API call:", error);
            lastError = error;
            // Try next endpoint on first failure of current
            endpoints.shift();
            retryCount++;
            if (retryCount >= MAX_RETRIES) {
                // Failed after max retries
                let friendlyError = "I apologize, but I am unable to connect to the AI service right now. Please try again later.";
                const msg = String(error.message || "");
                if (error.name === 'AbortError') {
                    friendlyError = "The chatbot service timed out. Please try again.";
                }
                if (msg.includes("400") || msg.includes("Proxy error")) {
                    friendlyError = "The chatbot service encountered a server error. Please try again.";
                } else if (msg.toLowerCase().includes("quota") || msg.includes("429") || msg.toLowerCase().includes("rate")) {
                    friendlyError = "Rate limit reached on the AI service. Please wait a moment and try again.";
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
    let friendlyError = "I apologize, but I am unable to connect to the AI service right now. Please try again later.";
    const msg = String((lastError && lastError.message) || "");
    if (lastError && lastError.name === 'AbortError') {
        friendlyError = "The chatbot service timed out. Please try again.";
    }
    if (msg.includes("400") || msg.includes("Proxy error")) {
        friendlyError = "The chatbot service encountered a server error. Please try again.";
    } else if (msg.toLowerCase().includes("quota") || msg.includes("429") || msg.toLowerCase().includes("rate")) {
        friendlyError = "Rate limit reached on the AI service. Please wait a moment and try again.";
    }
    appendMessage(friendlyError, 'ai');
    setChatState(false);
    return;
}

// Initialize the chatbot AFTER the main DOMContentLoaded has finished
// We wrap it in its own event listener to be safe.
function positionChatTip() {
    const tip = document.getElementById('chat-tip');
    const btn = document.getElementById('chat-toggle-button');
    if (!tip || !btn) return;
    const r = btn.getBoundingClientRect();
    const margin = 12;
    const tipRect = tip.getBoundingClientRect();
    const tipW = tipRect.width || 260;
    const tipH = tipRect.height || 40;
    let left = r.left + r.width / 2 - tipW / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tipW - margin));
    const belowTop = r.bottom + 12;
    const aboveTop = r.top - tipH - 12;
    let top;
    if (belowTop + tipH + margin <= window.innerHeight) {
        top = Math.min(window.innerHeight - tipH - margin, Math.max(margin, belowTop));
        tip.classList.add('below');
        tip.classList.remove('above');
    } else {
        top = Math.max(margin, aboveTop);
        tip.classList.add('above');
        tip.classList.remove('below');
    }
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.style.transform = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    initializeChatbot();
    const tip = document.getElementById('chat-tip');
    if (tip) {
        setTimeout(() => {
            positionChatTip();
            tip.textContent = 'Hi! How can I help you today?';
            tip.classList.remove('hidden');
            setTimeout(() => { tip.classList.add('hidden'); }, 7000);
        }, 2500);
        setTimeout(() => {
            if (!isChatOpen) {
                tip.textContent = 'Any Questions??';
                positionChatTip();
                tip.classList.remove('hidden');
                setTimeout(() => { tip.classList.add('hidden'); }, 5000);
            }
        }, 60000);
        window.addEventListener('resize', () => { if (!tip.classList.contains('hidden')) positionChatTip(); });
        window.addEventListener('scroll', () => { if (!tip.classList.contains('hidden')) positionChatTip(); });
    }
    
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isChatOpen) toggleChatWindow(); });
});

 

// ======================================================
// === END: CHATBOT JAVASCRIPT ===
// ======================================================