// ====== MOBILE MENU ======
(function() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar = document.getElementById('navbar');

    if (!mobileBtn || !mobileMenu) return;

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>';
            mobileBtn.style.transform = 'rotate(90deg)';
        } else {
            mobileMenu.classList.add('hidden');
            mobileBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
            mobileBtn.style.transform = 'rotate(0deg)';
        }
    }

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('nav-scrolled', 'shadow-md');
        } else {
            navbar.classList.remove('nav-scrolled', 'shadow-md');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && isMenuOpen) toggleMenu();
    });
})();


// ====== TYPEWRITER EFFECT ======
(function() {
    const words = ["Building Communities", "Academic Excellence", "Professional Excellence"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('changing-word');
    if (!element) return;
    let speed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            speed = 50;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            speed = 1500;
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }
        setTimeout(typeEffect, speed);
    }
    typeEffect();
})();


// ====== HORIZONTAL GALLERY SLIDER ======
(function() {
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dots = document.querySelectorAll('.slider-dot');
    const currentNum = document.getElementById('currentSlideNum');
    const totalNum = document.getElementById('totalSlidesNum');

    // Exit if slider doesn't exist on this page
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    const AUTO_PLAY_DELAY = 5000;

    // Set total slide count
    if (totalNum) totalNum.textContent = totalSlides;

    // Update slider position and active elements
    function updateSlider(index) {
        // Move the track
        track.style.transform = `translateX(-${index * 100}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('bg-[#E8B923]', 'scale-125');
            dot.classList.add('bg-gray-300');
            if (i === index) {
                dot.classList.add('bg-[#E8B923]', 'scale-125');
                dot.classList.remove('bg-gray-300');
            }
        });

        // Update counter
        if (currentNum) currentNum.textContent = index + 1;
    }

    // Go to a specific slide
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateSlider(currentIndex);
    }

    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
    }

    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    }

    // Reset autoplay timer
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Start autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    // ====== EVENT LISTENERS ======

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    // Keyboard support (Arrow keys)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderContainer = document.querySelector('.overflow-hidden');

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoPlay();
            }
        }, { passive: true });
    }

    // Pause autoplay on hover
    const sliderWrapper = document.querySelector('.relative.group');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        sliderWrapper.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }

    // Initialize slider
    updateSlider(0);
    startAutoPlay();

    console.log('🎠 Gallery slider initialized with', totalSlides, 'slides');
})();


// ====== TREE PLANTING ANIMATION ======
(function() {
    const tree = document.getElementById('draggableTree');
    const bucketTarget = document.getElementById('bucketTarget');
    const successMsg = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');
    const splash = document.getElementById('splash');
    const bucketEmoji = document.getElementById('bucket');

    // Exit if tree animation doesn't exist on this page
    if (!tree || !bucketTarget) return;

    let hasPlanted = false;
    let isDragging = false;
    let originalRect = null;

    function saveOriginalPosition() {
        originalRect = tree.getBoundingClientRect();
    }

    function resetTreePosition() {
        if (!originalRect) return;
        tree.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        tree.style.left = originalRect.left + 'px';
        tree.style.top = originalRect.top + 'px';
        setTimeout(() => {
            tree.style.position = '';
            tree.style.left = '';
            tree.style.top = '';
            tree.style.zIndex = '';
            tree.style.opacity = '1';
            tree.style.transform = 'scale(1)';
        }, 480);
    }

    // ====== DESKTOP DRAG & DROP ======
    tree.setAttribute('draggable', 'true');

    tree.addEventListener('dragstart', (e) => {
        if (hasPlanted) return;
        saveOriginalPosition();
        tree.classList.add('dragging');
        e.dataTransfer.setData('text/plain', 'tree');
    });

    tree.addEventListener('dragend', () => tree.classList.remove('dragging'));

    bucketTarget.addEventListener('dragover', (e) => {
        if (hasPlanted) return;
        e.preventDefault();
        bucketTarget.classList.add('drag-over');
    });

    bucketTarget.addEventListener('dragleave', () => {
        bucketTarget.classList.remove('drag-over');
    });

    bucketTarget.addEventListener('drop', (e) => {
        e.preventDefault();
        bucketTarget.classList.remove('drag-over');
        if (!hasPlanted) handleSuccessfulPlant();
    });

    // ====== MOBILE TOUCH ======
    tree.addEventListener('touchstart', (e) => {
        if (hasPlanted) return;
        isDragging = true;
        saveOriginalPosition();
        const touch = e.touches[0];
        tree.style.transition = 'none';
        tree.style.position = 'fixed';
        tree.style.left = (touch.clientX - 40) + 'px';
        tree.style.top = (touch.clientY - 40) + 'px';
        tree.style.zIndex = '1000';
        tree.classList.add('dragging');
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        tree.style.left = (touch.clientX - 40) + 'px';
        tree.style.top = (touch.clientY - 40) + 'px';
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (!isDragging || hasPlanted) return;
        isDragging = false;
        tree.classList.remove('dragging');
        handleSuccessfulPlant();
    });

    // ====== SUCCESS ANIMATION ======
    function handleSuccessfulPlant() {
        hasPlanted = true;

        // Hide tree with nice animation
        tree.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        tree.style.opacity = '0';
        tree.style.transform = 'scale(0.6) translateY(50px)';

        // Show splash effect
        splash.classList.add('active');

        // Show success message + reset button
        successMsg.classList.remove('hidden');
        resetBtn.classList.remove('hidden');

        // Celebration leaves burst
        createCelebrationBurst();

        // Bucket bounce
        bucketEmoji.style.transition = 'transform 0.6s ease';
        bucketEmoji.style.transform = 'scale(1.2) rotate(15deg)';
        setTimeout(() => {
            bucketEmoji.style.transform = 'scale(1) rotate(0deg)';
        }, 600);
    }

    // ====== CELEBRATION BURST ======
    function createCelebrationBurst() {
        const rect = bucketTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2 - 30;
        const leafEmojis = ['🍃', '🌿', '🍀', '🟢', '🌱'];

        for (let i = 0; i < 52; i++) {
            setTimeout(() => {
                const leaf = document.createElement('div');
                leaf.className = 'celebration-leaf';
                leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
                leaf.style.left = (centerX + (Math.random() - 0.5) * 80) + 'px';
                leaf.style.top = centerY + 'px';
                leaf.style.fontSize = (Math.random() * 24 + 18) + 'px';
                leaf.style.position = 'fixed';
                leaf.style.zIndex = '1000';
                leaf.style.pointerEvents = 'none';
                document.body.appendChild(leaf);

                const angle = Math.random() * 360;
                const distance = Math.random() * 165 + 135;
                const moveX = Math.cos(angle * Math.PI / 180) * distance;
                const moveY = Math.sin(angle * Math.PI / 180) * distance - (Math.random() * 90 + 80);

                leaf.animate([
                    { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                    { transform: `translate(${moveX*0.6}px, ${moveY*0.6}px) rotate(${angle*2}deg)`, opacity: 1 },
                    { transform: `translate(${moveX}px, ${moveY + 270}px) rotate(${angle*8}deg)`, opacity: 0 }
                ], {
                    duration: Math.random() * 1600 + 2300,
                    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                });
                setTimeout(() => leaf.remove(), 4500);
            }, i * 6);
        }
    }

    // ====== RESET ======
    resetBtn.addEventListener('click', () => {
        hasPlanted = false;
        isDragging = false;
        resetTreePosition();
        splash.classList.remove('active');
        successMsg.classList.add('hidden');
        resetBtn.classList.add('hidden');
    });
})();


// ====== FAQ TOGGLE (Contact Page) ======
(function() {
    // Make toggleFaq available globally for inline onclick
    window.toggleFaq = function(element) {
        const answer = element.nextElementSibling;
        const icon = element.querySelector('i');
        if (answer) {
            answer.classList.toggle('open');
        }
        if (icon) {
            icon.classList.toggle('rotate-180');
        }
    };
})();


// ====== CONTACT FORM ======
(function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const msg = document.getElementById('msg')?.value || '';

        if (name && email && subject && msg) {
            // Simple success message
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button ? button.innerHTML : '';

            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                button.style.background = '#22c55e';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 3000);
            }

            contactForm.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
})();


// ====== CONSOLE LOG ======
console.log('🌳 ALTRIN Website Loaded Successfully!');
console.log('📌 Motto: Transforming Lives | Building Communities');
console.log('📧 Contact: info@altrin.org');
console.log('📱 Pages: Home, About, Programs, Community, Contact');