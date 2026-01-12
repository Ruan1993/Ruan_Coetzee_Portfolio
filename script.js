/* ------------------------------------------------------------------
   1. TAILWIND CONFIGURATION
------------------------------------------------------------------ */
if (typeof window !== "undefined" && window.tailwind) {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    brand: {
                        blue: '#3B82F6',
                        purple: '#8B5CF6',
                        dark: '#020617'
                    }
                }
            }
        }
    };
}

/* ------------------------------------------------------------------
   2. GLOBAL PAGINATION LOGIC
   (Moved outside DOMContentLoaded so filterProjects can access it)
------------------------------------------------------------------ */
let currentCategoryPager = 'web';
// Track the starting index for each category independently
const currentStart = { web: 0, branding: 0, qr: 0, posters: 0 };
let pagerAuto = null;
function startPagerAuto() {
    if (pagerAuto) clearInterval(pagerAuto);
    pagerAuto = setInterval(() => nextPage(), 6000);
}

function getVisibleCount() {
    // 3 images on Desktop, 1 on Mobile
    return window.innerWidth >= 1024 ? 3 : 1;
}

function getCategoryItems(cat) {
    return Array.from(document.querySelectorAll(`.project-item.${cat}`));
}

function renderPage(cat) {
    const items = getCategoryItems(cat);
    const visible = getVisibleCount();

    // Ensure we don't scroll past the end
    const maxStart = Math.max(0, items.length - visible);
    
    // Safety check boundaries
    if (currentStart[cat] > maxStart) currentStart[cat] = maxStart;
    if (currentStart[cat] < 0) currentStart[cat] = 0;

    const start = currentStart[cat];

    // Toggle visibility
    items.forEach((item, idx) => {
        if (idx >= start && idx < start + visible) {
            item.style.display = 'block';
            // Small delay for fade-in effect
            setTimeout(() => item.style.opacity = '1', 50);
        } else {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });
}

function nextPage() {
    const items = getCategoryItems(currentCategoryPager);
    const visible = getVisibleCount();
    if (!items.length) return;
    const maxStart = Math.max(0, items.length - visible);
    if (currentStart[currentCategoryPager] < maxStart) {
        currentStart[currentCategoryPager]++;
    } else {
        currentStart[currentCategoryPager] = 0; // wrap to beginning
    }
    renderPage(currentCategoryPager);
}

function prevPage() {
    const items = getCategoryItems(currentCategoryPager);
    const visible = getVisibleCount();
    if (!items.length) return;
    const maxStart = Math.max(0, items.length - visible);
    if (currentStart[currentCategoryPager] > 0) {
        currentStart[currentCategoryPager]--;
    } else {
        currentStart[currentCategoryPager] = maxStart; // wrap to last window
    }
    renderPage(currentCategoryPager);
}

// This function is called directly by the HTML onclick events
function filterProjects(category, btn) {
    // 1. Reset Tab Styles
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('bg-brand-blue/10', 'text-brand-blue', 'border-brand-blue');
        b.classList.add('text-gray-400', 'border-gray-700');
        b.classList.remove('tab-active');
    });
    
    // 2. Activate Current Tab
    if (btn) {
        btn.classList.remove('text-gray-400', 'border-gray-700');
        btn.classList.add('bg-brand-blue/10', 'text-brand-blue', 'border-brand-blue', 'tab-active');
    }

    // 3. Hide all items initially to clear the view
    const allItems = document.querySelectorAll('.project-item');
    allItems.forEach(item => item.style.display = 'none');

    // 4. Set State & Render
    currentCategoryPager = category;
    currentStart[category] = 0; // always start from the first visible window
    renderPage(category);
    startPagerAuto();
}

/* ------------------------------------------------------------------
   3. APP INITIALIZATION (Wait for DOM)
------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    
    // -- Initialize Feather Icons & AOS --
    feather.replace();
    AOS.init({ once: true, offset: 100, duration: 800 });

    

    // -- Refresh Animations on Load/Resize --
    const refreshAOS = () => { if (typeof AOS !== 'undefined') AOS.refreshHard(); };
    window.addEventListener('load', refreshAOS);
    window.addEventListener('resize', () => {
        renderPage(currentCategoryPager); // Re-calculate visible items on resize
        setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 100);
    });

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = `2025-${currentYear}`;
    }

    // -- Mobile Menu --
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let ignoreNextDocClick = false;
    if (mobileBtn && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('block');
            mobileBtn.setAttribute('aria-expanded', 'true');
        };
        const closeMenu = () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('block');
            mobileBtn.setAttribute('aria-expanded', 'false');
        };

        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                openMenu();
                ignoreNextDocClick = true; // ignore the click that opened the menu
                setTimeout(() => { ignoreNextDocClick = false; }, 50);
            } else {
                closeMenu();
            }
        });
        // Also prevent touchstart bubbling on mobile
        mobileBtn.addEventListener('touchstart', (e) => { e.stopPropagation(); }, { passive: true });

        document.addEventListener('click', (e) => {
            if (ignoreNextDocClick) return;
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // -- Navbar Scroll --
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        const btt = document.getElementById('back-to-top');
        
        if (window.scrollY > 50) {
            nav.classList.add('bg-slate-900/90', 'shadow-lg');
            nav.classList.remove('glass');
        } else {
            nav.classList.add('glass');
            nav.classList.remove('bg-slate-900/90', 'shadow-lg');
        }

        if (btt) {
            if (window.scrollY > 400) {
                btt.classList.remove('opacity-0','pointer-events-none');
                btt.classList.add('opacity-100');
            } else {
                btt.classList.add('opacity-0','pointer-events-none');
                btt.classList.remove('opacity-100');
            }
        }
    });

    // -- Mobile Swipe for Selected Works --
    const pagerEl = document.getElementById('projects-pager');
    if (pagerEl) {
        let startX = 0;
        let startY = 0;
        let movedX = 0;
        let movedY = 0;
        let tracking = false;
        const threshold = 40;

        pagerEl.addEventListener('touchstart', (e) => {
            const t = e.changedTouches[0];
            startX = t.clientX;
            startY = t.clientY;
            movedX = 0;
            movedY = 0;
            tracking = true;
        }, { passive: true });

        pagerEl.addEventListener('touchmove', (e) => {
            if (!tracking) return;
            const t = e.changedTouches[0];
            movedX = t.clientX - startX;
            movedY = t.clientY - startY;
        }, { passive: true });

        pagerEl.addEventListener('touchend', () => {
            if (!tracking) return;
            tracking = false;
            const absX = Math.abs(movedX);
            const absY = Math.abs(movedY);
            if (absX > absY && absX > threshold) {
                if (movedX < 0) {
                    nextPage();
                } else {
                    prevPage();
                }
                startPagerAuto();
            }
        });
    }

    const backToTop = document.getElementById('back-to-top');
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // -- Connect Carousel Arrows --
    const projectsPrev = document.getElementById('projects-prev');
    const projectsNext = document.getElementById('projects-next');

    if (projectsPrev) projectsPrev.addEventListener('click', () => { prevPage(); startPagerAuto(); });
    if (projectsNext) projectsNext.addEventListener('click', () => { nextPage(); startPagerAuto(); });

    // -- Initialize Default Tab --
    const defaultWebTab = document.getElementById('tab-web');
    if (defaultWebTab) {
        // Manually trigger click or call function to set initial state
        filterProjects('web', defaultWebTab);
        startPagerAuto();
    }

    // Remove any previously added fullscreen buttons (simplify interaction to click image)
    document.querySelectorAll('.project-item button').forEach(b => {
        if (b.innerHTML.includes('maximize')) b.remove();
    });

    // -- Web3Forms Logic --
    const form = document.getElementById('agency-form');
    const result = document.getElementById('form-result');
    if (form && result) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            result.classList.remove('hidden');
            result.innerHTML = "Sending...";
            const submitBtn = form.querySelector('button');
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "✅ Message sent successfully!";
                    result.classList.add('text-green-500');
                    form.reset();
                } else {
                    result.innerHTML = json.message;
                    result.classList.add('text-red-500');
                }
            })
            .catch(error => {
                result.innerHTML = "Something went wrong!";
                result.classList.add('text-red-500');
            })
            .then(() => {
                submitBtn.disabled = false;
                setTimeout(() => result.classList.add('hidden'), 5000);
            });
        });
    }

    // -- Remove broken poster images, if any --
    document.querySelectorAll('.project-item.posters img').forEach(img => {
        const removeItem = () => img.closest('.project-item')?.remove();
        if (img.complete && img.naturalWidth === 0) removeItem();
        img.addEventListener('error', removeItem, { once: true });
    });

    // -- Lightbox Logic --
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCaption = document.getElementById('lightbox-caption');

    let galleryMap = { web: [], branding: [], qr: [], posters: [] };
    let currentLbCategory = null;
    let currentLbIndex = 0;

    function openLightbox(cat, idx) {
        currentLbCategory = cat;
        currentLbIndex = idx;
        updateLightbox();
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    function buildGalleries() {
        document.querySelectorAll('.project-item').forEach(item => {
            const img = item.querySelector('img');
            if (!img) return;

            // Determine category
            let cat = null;
            if (item.classList.contains('web')) cat = 'web';
            else if (item.classList.contains('branding')) cat = 'branding';
            else if (item.classList.contains('qr')) cat = 'qr';
            else if (item.classList.contains('posters')) cat = 'posters';

            if (!cat) return;

            const entry = { src: img.src, title: (item.querySelector('h3')?.textContent || '') };
            const idx = galleryMap[cat].length;
            galleryMap[cat].push(entry);

            // Click behavior
            if (cat === 'web') {
                const linkEl = item.querySelector('a[href^="http"]');
                if (linkEl) {
                    img.style.cursor = 'pointer';
                    item.style.cursor = 'pointer';
                    const openLink = (e) => { e.preventDefault(); window.open(linkEl.href, '_blank', 'noopener'); };
                    img.addEventListener('click', openLink);
                    item.addEventListener('click', openLink);
                }
            } else {
                img.style.cursor = 'zoom-in';
                item.style.cursor = 'zoom-in';
                const openImage = (e) => { e.preventDefault(); openLightbox(cat, idx); };
                img.addEventListener('click', openImage);
                item.addEventListener('click', openImage);
            }

            // Allow anchor clicks without triggering card click
            item.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => e.stopPropagation()));
        });
    }

    function openLightbox(category, index) {
        currentLbCategory = category;
        currentLbIndex = index;
        updateLightbox();
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex'); // Ensure flex display
        document.body.style.overflow = 'hidden';
    }

    function updateLightbox() {
        if (!currentLbCategory) return;
        const entry = galleryMap[currentLbCategory][currentLbIndex];
        if (entry) {
            lightboxImg.src = entry.src;
            lightboxCaption.textContent = entry.title;
        }
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = '';
    }

    if (lightbox) {
        buildGalleries();
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        
        // Lightbox Navigation
        if (lightboxNext) lightboxNext.addEventListener('click', () => {
            if (!currentLbCategory) return;
            currentLbIndex = (currentLbIndex + 1) % galleryMap[currentLbCategory].length;
            updateLightbox();
        });
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
            if (!currentLbCategory) return;
            currentLbIndex = (currentLbIndex - 1 + galleryMap[currentLbCategory].length) % galleryMap[currentLbCategory].length;
            updateLightbox();
        });
    }
});
