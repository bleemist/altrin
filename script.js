// ====== MOBILE MENU NAV ======
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
        } else {
            mobileMenu.classList.add('hidden');
            mobileBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        }
    }

    mobileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        toggleMenu();
    });

    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (isMenuOpen) toggleMenu();
        });
    });

    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 30) {
                navbar.classList.add('nav-scrolled', 'shadow-md');
            } else {
                navbar.classList.remove('nav-scrolled', 'shadow-md');
            }
        });
    }

    document.addEventListener('keydown', function(e) {
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
            speed = 1800;
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }
        setTimeout(typeEffect, speed);
    }
    typeEffect();
})();


// ====== HORIZONTAL GALLERY SLIDER (COMMUNITY & HOME) ======
(function() {
    const track = document.getElementById('sliderTrack');
    const sliderContainer = document.getElementById('sliderContainer') || document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dots = document.querySelectorAll('.slider-dot');
    const currentNum = document.getElementById('currentSlideNum');
    const totalNum = document.getElementById('totalSlidesNum');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    const AUTO_PLAY_DELAY = 5000;

    if (totalNum) totalNum.textContent = totalSlides;

    function updateSlider(index) {
        track.style.transform = 'translateX(-' + index * 100 + '%)';

        dots.forEach(function(dot, i) {
            dot.classList.remove('bg-[#E8B923]', 'scale-125');
            dot.classList.add('bg-gray-300');
            if (i === index) {
                dot.classList.add('bg-[#E8B923]', 'scale-125');
                dot.classList.remove('bg-gray-300');
            }
        });

        if (currentNum) currentNum.textContent = index + 1;
    }

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

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoPlay();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoPlay();
        });
    }

    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoPlay();
            }
        }, { passive: true });

        sliderContainer.addEventListener('mouseenter', function() {
            clearInterval(autoPlayInterval);
        });

        sliderContainer.addEventListener('mouseleave', function() {
            startAutoPlay();
        });
    }

    updateSlider(0);
    startAutoPlay();
})();


// ====== QUOTES AUTO-SLIDER (HOME PAGE - 5.0s AUTO ROTATION) ======
(function() {
    const track = document.getElementById('quoteSliderTrack');
    const container = document.getElementById('quoteSliderContainer');
    const slides = document.querySelectorAll('.quote-slide');
    const prevBtn = document.getElementById('prevQuote');
    const nextBtn = document.getElementById('nextQuote');
    const dots = document.querySelectorAll('.quote-dot');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;
    const AUTO_SLIDE_DELAY = 5000; // Exactly 5 seconds auto sliding

    function updateQuoteSlider(index) {
        track.style.transform = 'translateX(-' + index * 100 + '%)';

        dots.forEach(function(dot, i) {
            dot.classList.remove('bg-[#E8B923]', 'scale-125');
            dot.classList.add('bg-white/40');
            if (i === index) {
                dot.classList.add('bg-[#E8B923]', 'scale-125');
                dot.classList.remove('bg-white/40');
            }
        });
    }

    function goToQuote(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateQuoteSlider(currentIndex);
    }

    function nextQuote() {
        goToQuote(currentIndex + 1);
    }

    function prevQuote() {
        goToQuote(currentIndex - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoPlayTimer = setInterval(nextQuote, AUTO_SLIDE_DELAY);
    }

    function stopAutoSlide() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevQuote();
            restartAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextQuote();
            restartAutoSlide();
        });
    }

    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToQuote(index);
            restartAutoSlide();
        });
    });

    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);

        let touchStartX = 0;
        container.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', function(e) {
            let touchEndX = e.changedTouches[0].screenX;
            let diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) nextQuote();
                else prevQuote();
                restartAutoSlide();
            }
        }, { passive: true });
    }

    updateQuoteSlider(0);
    startAutoSlide();
})();


// ====== SCROLL REVEAL & ALL TITLE / CARD ANIMATIONS OBSERVER ======
(function() {
    const selector = '.card-lift, .hierarchy-node, section h2, .p-8.rounded-2xl, [class*="title-anim-"], [class*="card-anim-"]';
    const revealTargets = document.querySelectorAll(selector);

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active', 'animated');
                }
            });
        }, { threshold: 0.08 });

        revealTargets.forEach((target) => {
            if (!target.classList.contains('reveal')) {
                target.classList.add('reveal');
            }
            observer.observe(target);
        });
    } else {
        revealTargets.forEach((target) => target.classList.add('reveal', 'active', 'animated'));
    }
})();


// ====== TREE PLANTING INTERACTIVE ======
(function() {
    const tree = document.getElementById('draggableTree');
    const bucketTarget = document.getElementById('bucketTarget');
    const successMsg = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');
    const splash = document.getElementById('splash');
    const bucketEmoji = document.getElementById('bucket');

    if (!tree || !bucketTarget) return;

    let hasPlanted = false;

    function handleSuccessfulPlant() {
        hasPlanted = true;
        tree.style.transition = 'all 0.6s ease';
        tree.style.opacity = '0';
        tree.style.transform = 'scale(0.5)';
        if (splash) splash.classList.add('active');
        if (successMsg) successMsg.classList.remove('hidden');
        if (resetBtn) resetBtn.classList.remove('hidden');
        createCelebrationBurst();
        if (bucketEmoji) {
            bucketEmoji.style.transform = 'scale(1.2) rotate(15deg)';
            setTimeout(() => { bucketEmoji.style.transform = 'scale(1) rotate(0deg)'; }, 600);
        }
    }

    function createCelebrationBurst() {
        const rect = bucketTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const leafEmojis = ['🍃', '🌿', '🍀', '🌱'];

        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const leaf = document.createElement('div');
                leaf.className = 'celebration-leaf';
                leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
                leaf.style.left = centerX + 'px';
                leaf.style.top = centerY + 'px';
                leaf.style.fontSize = (Math.random() * 20 + 18) + 'px';
                document.body.appendChild(leaf);

                const angle = Math.random() * 360;
                const distance = Math.random() * 140 + 80;
                const moveX = Math.cos(angle * Math.PI / 180) * distance;
                const moveY = Math.sin(angle * Math.PI / 180) * distance - 80;

                leaf.animate([
                    { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                    { transform: `translate(${moveX}px, ${moveY + 200}px) rotate(${angle * 4}deg)`, opacity: 0 }
                ], {
                    duration: Math.random() * 1500 + 2000,
                    easing: 'ease-out'
                });

                setTimeout(() => leaf.remove(), 3500);
            }, i * 10);
        }
    }

    tree.setAttribute('draggable', 'true');
    tree.addEventListener('dragstart', (e) => {
        if (hasPlanted) return;
        e.dataTransfer.setData('text/plain', 'tree');
    });

    bucketTarget.addEventListener('dragover', (e) => {
        if (hasPlanted) return;
        e.preventDefault();
        bucketTarget.classList.add('drag-over');
    });

    bucketTarget.addEventListener('dragleave', () => bucketTarget.classList.remove('drag-over'));

    bucketTarget.addEventListener('drop', (e) => {
        e.preventDefault();
        bucketTarget.classList.remove('drag-over');
        if (!hasPlanted) handleSuccessfulPlant();
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            hasPlanted = false;
            tree.style.opacity = '1';
            tree.style.transform = 'scale(1)';
            if (splash) splash.classList.remove('active');
            if (successMsg) successMsg.classList.add('hidden');
            resetBtn.classList.add('hidden');
        });
    }
})();


// ====== FAQ ACCORDION ======
window.toggleFaq = function(element) {
    var answer = element.nextElementSibling;
    var icon = element.querySelector('i');
    if (answer) {
        answer.classList.toggle('open');
    }
    if (icon) {
        icon.classList.toggle('rotate-180');
    }
};


// ====== CONTACT FORM ======
(function() {
    var contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var button = contactForm.querySelector('button[type="submit"]');
        if (button) {
            var originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            button.style.background = '#22c55e';
            setTimeout(function() {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 3500);
        }
        contactForm.reset();
    });
})();

// Automatic portrait image detection & zoom logic
document.addEventListener('DOMContentLoaded', function() {
    const sliderImgs = document.querySelectorAll('#sliderTrack img');
    sliderImgs.forEach(function(img) {
        function checkPortrait() {
            if (img.naturalHeight > img.naturalWidth) {
                img.classList.add('gallery-portrait-img');
            }
        }
        if (img.complete) {
            checkPortrait();
        } else {
            img.addEventListener('load', checkPortrait);
        }
    });
});
