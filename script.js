// ====== MOBILE MENU ======
(function() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar = document.getElementById('navbar');

    // If either element is missing, log and exit
    if (!mobileBtn || !mobileMenu) {
        console.log('⚠️ Mobile menu elements not found on this page');
        return;
    }

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.style.display = 'flex'; // Ensure it's visible
            mobileBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>';
            mobileBtn.style.transform = 'rotate(90deg)';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.style.display = ''; // Reset
            mobileBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
            mobileBtn.style.transform = 'rotate(0deg)';
        }
    }

    // Click on hamburger button
    mobileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        toggleMenu();
    });

    // Auto close when clicking any menu link
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                // Close menu after a short delay to allow navigation
                setTimeout(function() {
                    toggleMenu();
                }, 150);
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !mobileBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 30) {
                navbar.classList.add('nav-scrolled', 'shadow-md');
            } else {
                navbar.classList.remove('nav-scrolled', 'shadow-md');
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && isMenuOpen) {
            toggleMenu();
        }
    });

    // Debug: Log that mobile menu is ready
    console.log('📱 Mobile menu initialized');
})();


// ====== TYPEWRITER EFFECT ======
(function() {
    const words = ["Building Communities", "Academic Excellence", "Professional Excellence"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('changing-word');
    if (!element) {
        console.log('⚠️ Typewriter element not found on this page');
        return;
    }
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
    console.log('⌨️ Typewriter effect started');
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
    if (!track || slides.length === 0) {
        console.log('⚠️ Gallery slider not found on this page');
        return;
    }

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
        resetAutoPlay();
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

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
    const sliderContainer = document.querySelector('.overflow-hidden');

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
    }

    const sliderWrapper = document.querySelector('.relative.group');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', function() {
            clearInterval(autoPlayInterval);
        });

        sliderWrapper.addEventListener('mouseleave', function() {
            startAutoPlay();
        });
    }

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

    if (!tree || !bucketTarget) {
        console.log('⚠️ Tree planting animation not found on this page');
        return;
    }

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
        setTimeout(function() {
            tree.style.position = '';
            tree.style.left = '';
            tree.style.top = '';
            tree.style.zIndex = '';
            tree.style.opacity = '1';
            tree.style.transform = 'scale(1)';
        }, 480);
    }

    tree.setAttribute('draggable', 'true');

    tree.addEventListener('dragstart', function(e) {
        if (hasPlanted) return;
        saveOriginalPosition();
        tree.classList.add('dragging');
        e.dataTransfer.setData('text/plain', 'tree');
    });

    tree.addEventListener('dragend', function() {
        tree.classList.remove('dragging');
    });

    bucketTarget.addEventListener('dragover', function(e) {
        if (hasPlanted) return;
        e.preventDefault();
        bucketTarget.classList.add('drag-over');
    });

    bucketTarget.addEventListener('dragleave', function() {
        bucketTarget.classList.remove('drag-over');
    });

    bucketTarget.addEventListener('drop', function(e) {
        e.preventDefault();
        bucketTarget.classList.remove('drag-over');
        if (!hasPlanted) handleSuccessfulPlant();
    });

    tree.addEventListener('touchstart', function(e) {
        if (hasPlanted) return;
        isDragging = true;
        saveOriginalPosition();
        var touch = e.touches[0];
        tree.style.transition = 'none';
        tree.style.position = 'fixed';
        tree.style.left = (touch.clientX - 40) + 'px';
        tree.style.top = (touch.clientY - 40) + 'px';
        tree.style.zIndex = '1000';
        tree.classList.add('dragging');
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        var touch = e.touches[0];
        tree.style.left = (touch.clientX - 40) + 'px';
        tree.style.top = (touch.clientY - 40) + 'px';
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (!isDragging || hasPlanted) return;
        isDragging = false;
        tree.classList.remove('dragging');
        handleSuccessfulPlant();
    });

    function handleSuccessfulPlant() {
        hasPlanted = true;
        tree.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        tree.style.opacity = '0';
        tree.style.transform = 'scale(0.6) translateY(50px)';
        splash.classList.add('active');
        successMsg.classList.remove('hidden');
        resetBtn.classList.remove('hidden');
        createCelebrationBurst();
        bucketEmoji.style.transition = 'transform 0.6s ease';
        bucketEmoji.style.transform = 'scale(1.2) rotate(15deg)';
        setTimeout(function() {
            bucketEmoji.style.transform = 'scale(1) rotate(0deg)';
        }, 600);
    }

    function createCelebrationBurst() {
        var rect = bucketTarget.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2 - 30;
        var leafEmojis = ['🍃', '🌿', '🍀', '🟢', '🌱'];

        for (var i = 0; i < 52; i++) {
            (function(i) {
                setTimeout(function() {
                    var leaf = document.createElement('div');
                    leaf.className = 'celebration-leaf';
                    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
                    leaf.style.left = (centerX + (Math.random() - 0.5) * 80) + 'px';
                    leaf.style.top = centerY + 'px';
                    leaf.style.fontSize = (Math.random() * 24 + 18) + 'px';
                    leaf.style.position = 'fixed';
                    leaf.style.zIndex = '1000';
                    leaf.style.pointerEvents = 'none';
                    document.body.appendChild(leaf);

                    var angle = Math.random() * 360;
                    var distance = Math.random() * 165 + 135;
                    var moveX = Math.cos(angle * Math.PI / 180) * distance;
                    var moveY = Math.sin(angle * Math.PI / 180) * distance - (Math.random() * 90 + 80);

                    leaf.animate([
                        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                        { transform: 'translate(' + (moveX*0.6) + 'px, ' + (moveY*0.6) + 'px) rotate(' + (angle*2) + 'deg)', opacity: 1 },
                        { transform: 'translate(' + moveX + 'px, ' + (moveY + 270) + 'px) rotate(' + (angle*8) + 'deg)', opacity: 0 }
                    ], {
                        duration: Math.random() * 1600 + 2300,
                        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                    });
                    setTimeout(function() { leaf.remove(); }, 4500);
                }, i * 6);
            })(i);
        }
    }

    resetBtn.addEventListener('click', function() {
        hasPlanted = false;
        isDragging = false;
        resetTreePosition();
        splash.classList.remove('active');
        successMsg.classList.add('hidden');
        resetBtn.classList.add('hidden');
    });

    console.log('🌳 Tree planting animation ready');
})();


// ====== FAQ TOGGLE ======
(function() {
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
    console.log('❓ FAQ toggle ready');
})();


// ====== CONTACT FORM ======
(function() {
    var contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log('⚠️ Contact form not found on this page');
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = document.getElementById('name')?.value || '';
        var email = document.getElementById('email')?.value || '';
        var subject = document.getElementById('subject')?.value || '';
        var msg = document.getElementById('msg')?.value || '';

        if (name && email && subject && msg) {
            var button = contactForm.querySelector('button[type="submit"]');
            var originalText = button ? button.innerHTML : '';

            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                button.style.background = '#22c55e';
                setTimeout(function() {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 3000);
            }

            contactForm.reset();
            console.log('📧 Contact form submitted successfully');
        } else {
            alert('Please fill in all required fields.');
        }
    });
    console.log('📧 Contact form ready');
})();


// ====== CONSOLE LOG ======
console.log('🌳 ALTRIN Website Loaded Successfully!');
console.log('📌 Motto: Transforming Lives | Building Communities');
console.log('📧 Contact: info@altrin.org');
console.log('📱 Pages: Home, About, Programs, Community, Contact');
console.log('✅ All features ready.');