const words = ["nibiru fae", "gb-073", "g8", "li milan", "erebus nyx", "polexia al-twal", "wotan al-kitab", "zøe ha-razim", "stella nazar", "tris kemet", "penny lane", "surya samhita"];
const wordElement = document.getElementById("word");

// Custom cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <g class="circle-group">
            <circle cx="16" cy="16" r="14" fill="none" stroke="#ffd447" stroke-width="1.5" opacity="0.6"/>
            <!-- Tick marks at cardinal directions -->
            <line x1="16" y1="1" x2="16" y2="4" stroke="#ffd447" stroke-width="1.5" opacity="0.6"/>
            <line x1="16" y1="28" x2="16" y2="31" stroke="#ffd447" stroke-width="1.5" opacity="0.6"/>
            <line x1="1" y1="16" x2="4" y2="16" stroke="#ffd447" stroke-width="1.5" opacity="0.6"/>
            <line x1="28" y1="16" x2="31" y2="16" stroke="#ffd447" stroke-width="1.5" opacity="0.6"/>
        </g>
        <g class="chevron chevron-top">
            <g class="chevron-inner">
                <polyline points="12,8 16,12 20,8" fill="none" stroke="#ffd447" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </g>
        <g class="chevron chevron-bottom">
            <g class="chevron-inner">
                <polyline points="12,24 16,20 20,24" fill="none" stroke="#ffd447" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </g>
        <g class="chevron chevron-left">
            <g class="chevron-inner">
                <polyline points="8,12 12,16 8,20" fill="none" stroke="#ffd447" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </g>
        <g class="chevron chevron-right">
            <g class="chevron-inner">
                <polyline points="24,12 20,16 24,20" fill="none" stroke="#ffd447" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </g>
        <circle cx="16" cy="16" r="1.5" fill="#ffd447"/>
    </svg>
`;
document.body.appendChild(cursor);

let rotationDirection = Math.random() > 0.5 ? 1 : -1; // 1 for clockwise, -1 for counter-clockwise
let isHovering = false;
let circleAngle = 0;
let chevronAngle = 0;
let animationFrameId = null;
let lastTime = null;

// Handle fullscreen changes
function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    cursor.style.display = isFullscreen ? 'none' : 'block';
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);

const ROTATION_SPEED = 180; // degrees per second

function setCursorVisible(visible) {
    cursor.style.display = visible ? 'block' : 'none';
    if (!visible && isHovering) {
        isHovering = false;
    }
}

function animateRotation(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000; // convert to seconds
    lastTime = currentTime;
    
    if (isHovering) {
        // Update angles based on direction
        chevronAngle += ROTATION_SPEED * deltaTime * rotationDirection;
        circleAngle -= ROTATION_SPEED * deltaTime * rotationDirection; // Circle goes opposite direction
        
        // Apply rotations
        const circleGroup = cursor.querySelector('.circle-group');
        const chevrons = cursor.querySelectorAll('.chevron');
        
        circleGroup.style.transform = `rotate(${circleAngle}deg)`;
        chevrons.forEach(chevron => {
            chevron.style.transform = `rotate(${chevronAngle}deg)`;
        });
    }
    
    animationFrameId = requestAnimationFrame(animateRotation);
}

// Start the animation loop
animationFrameId = requestAnimationFrame(animateRotation);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Check if hovering over any clickable element
    const target = document.elementFromPoint(e.clientX, e.clientY);
    
    // Hide cursor entirely when over any iframe
    const isIframe = target && target.tagName === 'IFRAME';
    if (isIframe) {
        setCursorVisible(false);
        return;
    }
    setCursorVisible(true);
    
    // Check for clickable elements: links, buttons, or elements with cursor: pointer
    const isClickable = target && (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' && (target.type === 'button' || target.type === 'submit' || target.type === 'checkbox' || target.type === 'radio') ||
        target.tagName === 'SELECT' ||
        target.tagName === 'VIDEO' ||
        target.tagName === 'AUDIO' ||
        target.tagName === 'IFRAME' ||
        target.tagName === 'IMG' && target.style.cursor === 'pointer' ||
        target.closest('a, button, [role="button"], [role="tab"], [role="link"], .project-media img, .project-media video, .project-media iframe') ||
        target.getAttribute('role') === 'button' ||
        target.getAttribute('role') === 'tab' ||
        target.getAttribute('role') === 'link' ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.onclick !== null ||
        target.hasAttribute('onclick') ||
        target.hasAttribute('data-action') ||
        target.classList.contains('clickable') ||
        target.classList.contains('carousel-control') ||
        target.classList.contains('carousel-prev') ||
        target.classList.contains('carousel-next') ||
        target.classList.contains('expandable') ||
        (target.tagName === 'IMG' && target.closest('.project-media'))
    );
    
    const shouldHover = isClickable;
    
    if (shouldHover && !isHovering) {
        isHovering = true;
        rotationDirection = Math.random() > 0.5 ? 1 : -1;
        lastTime = null; // Reset time for smooth transition
    } else if (!shouldHover && isHovering) {
        isHovering = false;
    }
});

document.querySelectorAll('iframe').forEach((frame) => {
    frame.addEventListener('mouseenter', () => setCursorVisible(false));
    frame.addEventListener('mouseleave', () => setCursorVisible(true));
});

document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
});

const TYPE_SPEED = 100;      // ms per typed character
const DELETE_SPEED = 50;    // ms per deleted character
const PAUSE_AFTER_TYPE = 2000;   // ms pause after finishing a word
const PAUSE_AFTER_DELETE = 2000; // ms pause after deleting to blank (blank i am)
const BLANK_PAUSE = 2000;        // ms initial pause on blank before first word

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setWidthForLen(len) {
    // animate horizontal scoot via width transition in CSS
    wordElement.style.width = `${len}ch`;
}

// Function to scale title down if it overflows
function adjustTitleScale() {
    const titleElement = document.querySelector('.title');
    if (!titleElement) return;
    
    const container = titleElement.parentElement;
    const containerWidth = container.clientWidth;
    
    // Reset font size to default to measure natural width
    titleElement.style.fontSize = '';
    
    // Check if title overflows - use 88% to ensure period stays in bounds
    if (titleElement.scrollWidth > containerWidth * 0.88) {
        // Get computed font size and reduce it
        const computedStyle = window.getComputedStyle(titleElement);
        const currentFontSize = parseFloat(computedStyle.fontSize);
        
        // Calculate scale factor needed with extra margin for the period
        const scale = (containerWidth * 0.88) / titleElement.scrollWidth;
        const newFontSize = currentFontSize * Math.max(scale, 0.7);
        
        titleElement.style.fontSize = newFontSize + 'px';
    }
}

async function typeWord(word) {
    wordElement.classList.add('typing');
    // Move caret one space before first letter to reduce jitter
    setWidthForLen(1);
    await sleep(TYPE_SPEED);
    for (let i = 1; i <= word.length; i++) {
        const fragment = word.slice(0, i);
        wordElement.textContent = fragment;
        setWidthForLen(i);
        requestAnimationFrame(adjustTitleScale);
        await sleep(TYPE_SPEED);
    }
    wordElement.classList.remove('typing');
    await sleep(PAUSE_AFTER_TYPE);
}

async function deleteWord() {
    wordElement.classList.add('typing');
    let current = wordElement.textContent.length;
    // Delete down to 1ch, keeping caret aligned with last visible char
    for (let i = current; i >= 1; i--) {
        const fragment = wordElement.textContent.slice(0, i);
        wordElement.textContent = fragment;
        setWidthForLen(i);
        requestAnimationFrame(adjustTitleScale);
        await sleep(DELETE_SPEED);
    }
    // Single solid step back to base (blank, caret at 0)
    wordElement.textContent = '';
    setWidthForLen(0);
    await sleep(DELETE_SPEED);
    wordElement.classList.remove('typing');
    await sleep(PAUSE_AFTER_DELETE);
}

async function runLoop() {
    // start blank
    wordElement.textContent = '';
    setWidthForLen(0);
    // pause on blank before typing first word
    await sleep(BLANK_PAUSE);
    let lastWord = null;
    while (true) {
        // Pick random word different from last
        let word;
        do {
            word = words[Math.floor(Math.random() * words.length)];
        } while (word === lastWord && words.length > 1);
        lastWord = word;
        
        await typeWord(word);
        await deleteWord();
    }
}

// Adjust title scale on window resize
window.addEventListener('resize', adjustTitleScale);

runLoop();

function displayWord(text) {
    wordElement.innerHTML = '';
    const chars = text.split('');
    // Set container width to current word length so flex centering accounts for it
    wordElement.style.width = `${chars.length}ch`;
    
    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('char');
        span.style.left = `${i}ch`;
        wordElement.appendChild(span);
    });
}

function transitionWord(newText) {
    const currentChars = wordElement.querySelectorAll('.char');
    const newChars = newText.split('');
    // Update container width to the incoming word before animating
    wordElement.style.width = `${newChars.length}ch`;
    const maxLength = Math.max(currentChars.length, newChars.length);
    
    for (let i = 0; i < maxLength; i++) {
        setTimeout(() => {
            const currentChar = currentChars[i];
            
            // Fall out the old character
            if (currentChar) {
                currentChar.classList.add('fall-out');
                setTimeout(() => currentChar.remove(), 400);
            }
            
            // Add the new character
            if (newChars[i]) {
                const span = document.createElement('span');
                span.textContent = newChars[i];
                span.classList.add('char', 'fall-in');
                span.style.left = `${i}ch`;
                wordElement.appendChild(span);
            }
        }, i * 100);
    }
}

// Interval-based animation removed in favor of async type/delete loop

// Collapsible subsections with persisted state
const subsections = document.querySelectorAll('.subsection');
subsections.forEach((subsection) => {
    const toggleLink = subsection.querySelector('.subsection-toggle');
    if (!toggleLink) return;
    
    const subsectionId = toggleLink.textContent.trim();
    const storageKey = `subsection-${subsectionId}`;
    
    // restore persisted state
    const saved = localStorage.getItem(storageKey) === 'true';
    if (saved) {
        subsection.classList.add('open');
        toggleLink.classList.add('is-active');
    }
    toggleLink.setAttribute('aria-expanded', saved ? 'true' : 'false');

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = subsection.classList.toggle('open');
        toggleLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggleLink.classList.toggle('is-active', isOpen);
        localStorage.setItem(storageKey, isOpen ? 'true' : 'false');
    });
});

// Link accenting for selected menu options without navigation
const linktree = document.querySelector('.linktree');
const linktreeLinks = document.querySelectorAll('.linktree a');

function markActiveLink(target) {
    // keep toggle indicators managed separately
    linktreeLinks.forEach((link) => {
        if (!link.classList.contains('subsection-toggle')) {
            link.classList.remove('is-active');
        }
    });
    target.classList.add('is-active');
}

if (linktree) {
    linktree.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor || !linktree.contains(anchor)) return;
        // toggles use their own handler
        if (anchor.classList.contains('subsection-toggle')) return;
        
        // Handle dropdown subitems: add active class on click, fade out after
        if (anchor.closest('.sub-list')) {
            // Check if link actually navigates (not just placeholder)
            const href = anchor.getAttribute('href');
            if (href && href !== '#') {
                // Link navigates - let it proceed without click effect
                return;
            }
            // Placeholder links get the click effect
            e.preventDefault();
            anchor.classList.add('is-active');
            // fade out the highlight after 75ms
            setTimeout(() => {
                anchor.classList.remove('is-active');
            }, 75);
            return;
        }
        
        // anchor links that are placeholders stay highlighted when chosen
        if (anchor.getAttribute('href') === '#') {
            e.preventDefault();
            markActiveLink(anchor);
        }
    });
}

// Contact link: fade out nav, fade in form
const contactLink = document.getElementById('contact-link');
const contactFormSection = document.getElementById('contact-form');
const cancelBtn = document.getElementById('form-cancel');
const panelStack = document.querySelector('.panel-stack');

function waitOpacityTransition(el) {
    return new Promise((resolve) => {
        const handler = (e) => {
            if (e.propertyName === 'opacity') {
                el.removeEventListener('transitionend', handler);
                resolve();
            }
        };
        el.addEventListener('transitionend', handler);
    });
}

if (panelStack && contactLink && linktree && contactFormSection) {
    // initialize container height to nav height
    panelStack.style.height = linktree.scrollHeight + 'px';

    let animating = false;
    contactLink.addEventListener('click', async (e) => {
        e.preventDefault();
        if (animating) return;
        animating = true;
        markActiveLink(contactLink);
        // fade out nav completely first
        linktree.classList.add('is-hidden');
        await waitOpacityTransition(linktree);
        // then show form and adjust height
        contactFormSection.setAttribute('aria-hidden', 'false');
        contactFormSection.classList.add('is-visible');
        panelStack.style.height = contactFormSection.scrollHeight + 'px';
        await waitOpacityTransition(contactFormSection);
        animating = false;
    });
}

if (panelStack && cancelBtn && linktree && contactFormSection) {
    let animatingBack = false;
    cancelBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (animatingBack) return;
        animatingBack = true;
        contactLink.classList.remove('is-active');
        // fade out form completely first
        contactFormSection.classList.remove('is-visible');
        contactFormSection.setAttribute('aria-hidden', 'true');
        await waitOpacityTransition(contactFormSection);
        // then show nav and adjust height
        linktree.classList.remove('is-hidden');
        panelStack.style.height = linktree.scrollHeight + 'px';
        await waitOpacityTransition(linktree);
        animatingBack = false;
    });
}

// ===== GLOSSARY AUTO-HIGHLIGHT SYSTEM =====
// Automatically extract glossary terms and highlight them on non-glossary pages

async function initGlossaryHighlighting() {
    // Skip if we're on the glossary page itself
    if (window.location.pathname.includes('glossary.html')) {
        return;
    }
    
    // Determine the correct path to glossary based on current page location
    const pathDepth = window.location.pathname.split('/').filter(p => p).length;
    const isInDossier = window.location.pathname.includes('/dossier/');
    const glossaryPath = isInDossier ? './glossary.html' : './dossier/glossary.html';
    
    // Fetch glossary terms from glossary.html
    try {
        const response = await fetch(glossaryPath);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract all glossary terms from term-cell elements
        const termElements = doc.querySelectorAll('.term-cell');
        const glossaryTerms = Array.from(termElements)
            .map(el => el.textContent.trim())
            .filter(term => term.length > 0);
        
        if (glossaryTerms.length === 0) return;
        
        // Highlight matching terms in page content
        highlightTermsInDOM(glossaryTerms, glossaryPath);
    } catch (error) {
        console.error('Failed to load glossary:', error);
    }
}

function highlightTermsInDOM(terms, glossaryPath) {
    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
    
    // Create a regex pattern that matches whole words only
    const escapedTerms = sortedTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');
    
    // Create a map of terms to their glossary sections (lowercase for matching)
    const termSectionMap = {};
    terms.forEach(term => {
        // Determine which section each term belongs to based on glossary structure
        // This will be populated after fetching glossary
        termSectionMap[term.toLowerCase()] = null;
    });
    
    // Get all text nodes in the body (exclude script, style, and already highlighted elements)
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip if parent is script, style, or already has highlight class
                const parent = node.parentElement;
                if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.classList.contains('highlight') || parent.tagName === 'A') {
                    return NodeFilter.FILTER_REJECT;
                }
                // Skip glossary page content
                if (parent.closest('.glossary-scroll')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    
    const nodesToProcess = [];
    let node;
    while (node = walker.nextNode()) {
        nodesToProcess.push(node);
    }
    
    // Process each text node
    nodesToProcess.forEach(textNode => {
        if (!pattern.test(textNode.textContent)) return;
        
        // Reset regex state
        pattern.lastIndex = 0;
        
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        
        while ((match = pattern.exec(textNode.textContent)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(textNode.textContent.slice(lastIndex, match.index))
                );
            }
            
            // Add highlighted term as a clickable link to glossary
            const link = document.createElement('a');
            link.className = 'highlight';
            link.textContent = match[0];
            // Convert multi-word terms to kebab-case for anchor linking
            const anchorId = match[0].toLowerCase().trim().replace(/\s+/g, '-');
            link.href = glossaryPath + '#' + anchorId;
            link.style.textDecoration = 'none';
            link.style.cursor = 'pointer';
            fragment.appendChild(link);
            
            lastIndex = pattern.lastIndex;
        }
        
        // Add remaining text
        if (lastIndex < textNode.textContent.length) {
            fragment.appendChild(
                document.createTextNode(textNode.textContent.slice(lastIndex))
            );
        }
        
        // Replace original text node with new fragment
        textNode.parentNode.replaceChild(fragment, textNode);
    });
}

// Image Fullscreen Modal
function initImageModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.className = 'image-modal';
        modal.innerHTML = '<div class="image-modal-content"><button class="image-modal-close">&times;</button></div>';
        document.body.appendChild(modal);
    }

    // Add click handlers to all project images (except those inside links)
    const projectImages = document.querySelectorAll('.project-media img');
    projectImages.forEach(img => {
        // Skip images that are inside links
        if (img.closest('a')) {
            return;
        }

        img.addEventListener('click', function() {
            const modalContent = modal.querySelector('.image-modal-content');
            const existingImg = modalContent.querySelector('img');
            
            // Remove old image if exists
            if (existingImg) {
                existingImg.remove();
            }
            
            // Clone and add new image
            const clonedImg = this.cloneNode(true);
            clonedImg.style.cursor = 'auto';
            modalContent.insertBefore(clonedImg, modalContent.querySelector('.image-modal-close'));
            modal.classList.add('active');
        });
    });

    // Close button handler
    const closeBtn = modal.querySelector('.image-modal-close');
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        modal.classList.remove('active');
    });

    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

function initCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    
    let currentSlide = 0;
    const dots = document.querySelectorAll('.dot');
    const totalSlides = 2;
    const buttons = document.querySelectorAll('.carousel-control');

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.style.background = index === currentSlide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)';
        });
    }

    // Add hover and click effects to buttons
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.color = 'white';
            this.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.color = 'var(--text)';
            this.style.textShadow = 'none';
        });
        button.addEventListener('mousedown', function() {
            this.style.color = 'var(--accent)';
            this.style.textShadow = '0 0 15px rgba(255,212,71,0.8)';
        });
        button.addEventListener('mouseup', function() {
            this.style.color = 'white';
            this.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
        });
    });

    window.moveCarousel = function(direction) {
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        updateCarousel();
    };

    window.goToSlide = function(index) {
        currentSlide = index;
        updateCarousel();
    };

    updateCarousel();
}

// ===== SECURE CONTACT FORM =====
// Form validation, sanitization, and secure submission

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Rate limiting: track submission attempts
    const RATE_LIMIT_KEY = 'form_last_submission';
    const RATE_LIMIT_MS = 60000; // 1 minute between submissions
    
    // Input sanitization: remove potentially dangerous characters
    function sanitizeInput(input) {
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML.trim();
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation (optional field)
    function isValidPhone(phone) {
        if (!phone) return true; // Optional field
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        return phoneRegex.test(phone);
    }
    
    // Clear all error messages
    function clearErrors() {
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        const feedback = document.getElementById('form-feedback');
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'form-feedback';
        }
    }
    
    // Show error message for a field
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Show form-wide feedback message
    function showFeedback(message, type = 'error') {
        const feedback = document.getElementById('form-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `form-feedback ${type}`;
            feedback.style.display = 'block';
        }
    }
    
    // Validate form fields
    function validateForm(formData) {
        clearErrors();
        let isValid = true;
        
        // Check honeypot (if filled, it's a bot)
        if (formData.get('_honeypot')) {
            return false; // Silent fail for bots
        }
        
        // Name validation
        const name = sanitizeInput(formData.get('name') || '');
        if (!name || name.length < 2) {
            showError('name', 'please enter your name');
            isValid = false;
        } else if (name.length > 100) {
            showError('name', 'name is too long');
            isValid = false;
        }
        
        // Email validation
        const email = sanitizeInput(formData.get('email') || '');
        if (!email) {
            showError('email', 'please enter your email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'please enter a valid email');
            isValid = false;
        } else if (email.length > 254) {
            showError('email', 'email is too long');
            isValid = false;
        }
        
        // Phone validation (optional)
        const phone = sanitizeInput(formData.get('phone') || '');
        if (phone && !isValidPhone(phone)) {
            showError('phone', 'please enter a valid phone number');
            isValid = false;
        }
        
        // Subject validation
        const subject = formData.get('subject') || '';
        if (!subject) {
            showError('subject', 'please choose a subject');
            isValid = false;
        }
        
        // Message validation
        const message = sanitizeInput(formData.get('message') || '');
        if (!message || message.length < 10) {
            showError('message', 'please enter a message (at least 10 characters)');
            isValid = false;
        } else if (message.length > 5000) {
            showError('message', 'message is too long (max 5000 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Check rate limiting
    function checkRateLimit() {
        const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
        if (lastSubmission) {
            const timeSince = Date.now() - parseInt(lastSubmission);
            if (timeSince < RATE_LIMIT_MS) {
                const secondsLeft = Math.ceil((RATE_LIMIT_MS - timeSince) / 1000);
                return { allowed: false, secondsLeft };
            }
        }
        return { allowed: true };
    }
    
    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Rate limiting check
        const rateCheck = checkRateLimit();
        if (!rateCheck.allowed) {
            showFeedback(`please wait ${rateCheck.secondsLeft} seconds before submitting again`, 'error');
            return;
        }
        
        const formData = new FormData(form);
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Disable submit button during submission
        const submitBtn = form.querySelector('button[type=\"submit\"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'sending...';
        
        try {
            // CONFIGURATION: Replace with your Web3Forms Access Key
            // Get your free access key at: https://web3forms.com/
            const WEB3FORMS_ACCESS_KEY = 'a3bf7163-8af1-4d2a-8616-11201430156d';
            
            // Add Web3Forms access key to form data
            formData.append('access_key', WEB3FORMS_ACCESS_KEY);
            
            // Optional: Customize email subject
            formData.append('subject', `Contact Form: ${formData.get('subject')}`);
            
            // Optional: Redirect URL after successful submission (can be removed)
            // formData.append('redirect', 'https://yourdomain.com/thank-you');
            
            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update rate limit
                localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
                
                // Show success message
                showFeedback('message sent successfully!', 'success');
                
                // Clear form
                form.reset();
                
                // Optional: Close form after 3 seconds
                setTimeout(() => {
                    const cancelBtn = document.getElementById('form-cancel');
                    if (cancelBtn) {
                        cancelBtn.click();
                    }
                }, 3000);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFeedback('something went wrong. please try again later.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
    
    // Clear errors when user starts typing
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.id}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initGlossaryHighlighting();
    initImageModal();
    initCarousel();
    initScrollGlows();
    initFilterNav();
    initAvatarDropdowns();
    initCustomMediaControls();
    initVideoHoverControls();
    initContactForm();
});
// Also run immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initGlossaryHighlighting();
        initImageModal();
    });
} else {
    initGlossaryHighlighting();
    initImageModal();
}

// ===== SCROLL GLOW INDICATORS =====
// For pages with scrollable content (logs, maps, recipes, statement, analysis)
function initScrollGlows() {
    const scroll = document.querySelector('.content-scroll');
    if (!scroll) return;
    
    let scrollState = { canScrollDown: false };
    
    function updateGlows() {
        const canScrollDown = scroll.scrollTop < (scroll.scrollHeight - scroll.clientHeight);
        
        if (canScrollDown !== scrollState.canScrollDown) {
            scrollState.canScrollDown = canScrollDown;
            if (canScrollDown) {
                scroll.classList.add('has-scroll-down');
            } else {
                scroll.classList.remove('has-scroll-down');
            }
        }
    }
    
    window.addEventListener('load', updateGlows);
    window.addEventListener('resize', updateGlows);
    scroll.addEventListener('scroll', updateGlows);
}

// ===== FILTER NAV GLOWS AND FILTERING =====
// For analysis.html with filter buttons
function initFilterNav() {
    const filterNav = document.querySelector('.filter-nav');
    if (!filterNav) return;
    
    let scrollState = { filterNavScrollLeft: false, filterNavScrollRight: false };
    let activeFilters = new Set(['all']);
    
    function updateFilterNavGlows() {
        const canScrollLeft = filterNav.scrollLeft > 0;
        const canScrollRight = filterNav.scrollLeft < (filterNav.scrollWidth - filterNav.clientWidth);
        
        if (canScrollLeft !== scrollState.filterNavScrollLeft) {
            scrollState.filterNavScrollLeft = canScrollLeft;
            if (canScrollLeft) {
                filterNav.classList.add('has-scroll-left');
            } else {
                filterNav.classList.remove('has-scroll-left');
            }
        }
        
        if (canScrollRight !== scrollState.filterNavScrollRight) {
            scrollState.filterNavScrollRight = canScrollRight;
            if (canScrollRight) {
                filterNav.classList.add('has-scroll-right');
            } else {
                filterNav.classList.remove('has-scroll-right');
            }
        }
    }
    
    function filterSections() {
        const sections = document.querySelectorAll('.analysis-section');
        
        sections.forEach(section => {
            const filterValue = section.getAttribute('data-filter');
            const shouldShow = activeFilters.has('all') || activeFilters.has(filterValue);
            section.style.display = shouldShow ? 'block' : 'none';
        });
    }
    
    function setupFilterButtons() {
        const buttons = document.querySelectorAll('.filter-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                if (filter === 'all') {
                    activeFilters.clear();
                    activeFilters.add('all');
                    buttons.forEach(btn => {
                        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
                    });
                } else {
                    activeFilters.delete('all');
                    
                    if (activeFilters.has(filter)) {
                        activeFilters.delete(filter);
                    } else {
                        activeFilters.add(filter);
                    }
                    
                    // If no filters selected, default to all
                    if (activeFilters.size === 0) {
                        activeFilters.add('all');
                    }
                    
                    buttons.forEach(btn => {
                        const btnFilter = btn.getAttribute('data-filter');
                        if (btnFilter === 'all') {
                            btn.classList.toggle('active', activeFilters.has('all'));
                        } else {
                            btn.classList.toggle('active', activeFilters.has(btnFilter));
                        }
                    });
                }
                
                filterSections();
            });
        });
    }
    
    window.addEventListener('load', () => {
        updateFilterNavGlows();
        setupFilterButtons();
    });
    window.addEventListener('resize', updateFilterNavGlows);
    filterNav.addEventListener('scroll', updateFilterNavGlows);
}

// ===== AVATAR DROPDOWNS =====
// For avatars.html page
function initAvatarDropdowns() {
    const glossaryScroll = document.querySelector('.glossary-scroll');
    const sectionNav = document.querySelector('.section-nav');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    if (viewBtns.length === 0 && !glossaryScroll) return;
    
    // Update scroll glows for avatars page
    function updateGlows() {
        if (glossaryScroll) {
            const canScrollUp = glossaryScroll.scrollTop > 0;
            const canScrollDown = glossaryScroll.scrollHeight > glossaryScroll.clientHeight && 
                                glossaryScroll.scrollTop < glossaryScroll.scrollHeight - glossaryScroll.clientHeight;
            glossaryScroll.classList.toggle('has-scroll-up', canScrollUp);
            glossaryScroll.classList.toggle('has-scroll-down', canScrollDown);
        }
        
        if (sectionNav) {
            const canScrollLeft = sectionNav.scrollLeft > 0;
            const canScrollRight = sectionNav.scrollLeft < sectionNav.scrollWidth - sectionNav.clientWidth;
            sectionNav.classList.toggle('has-scroll-left', canScrollLeft);
            sectionNav.classList.toggle('has-scroll-right', canScrollRight);
        }
    }
    
    if (glossaryScroll || sectionNav) {
        window.addEventListener('load', updateGlows);
        window.addEventListener('resize', updateGlows);
        
        if (glossaryScroll) glossaryScroll.addEventListener('scroll', updateGlows);
        if (sectionNav) sectionNav.addEventListener('scroll', updateGlows);
        
        updateGlows();
    }

    // Handle view buttons and dropdown
    if (viewBtns.length > 0) {
        const worksModal = document.getElementById('worksModal');
        const worksDropdown = document.getElementById('worksDropdown');
        const worksList = document.getElementById('worksList');
        let activeBtn = null;

        function positionDropdown() {
            if (activeBtn && glossaryScroll) {
                const rect = activeBtn.getBoundingClientRect();
                const scrollBoxRect = glossaryScroll.getBoundingClientRect();
                worksDropdown.style.top = (rect.bottom - scrollBoxRect.top + glossaryScroll.scrollTop - 1) + 'px';
                worksDropdown.style.right = (scrollBoxRect.right - rect.right) + 'px';
            }
        }

        function closeDropdown() {
            if (activeBtn) {
                activeBtn.classList.remove('is-active');
            }
            if (worksModal) {
                worksModal.classList.remove('active');
            }
            activeBtn = null;
        }

        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const isOpen = btn.classList.contains('is-active');
                
                if (isOpen) {
                    closeDropdown();
                } else {
                    // Close any other open dropdowns
                    if (activeBtn) {
                        activeBtn.classList.remove('is-active');
                    }
                    
                    activeBtn = btn;
                    const works = JSON.parse(btn.dataset.works);
                    btn.classList.add('is-active');
                    
                    // Populate the dropdown
                    if (worksList) {
                        worksList.innerHTML = works.map(work => 
                            `<a href="${work.href}" class="work-link">${work.name}</a>`
                        ).join('');
                    }
                    
                    // Position dropdown near the button
                    positionDropdown();
                    
                    // Show the modal
                    if (worksModal) {
                        worksModal.classList.add('active');
                    }
                }
                e.stopPropagation();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (worksDropdown && !worksDropdown.contains(e.target) && !e.target.classList.contains('view-btn')) {
                closeDropdown();
            }
        });

        // Close dropdown when clicking a link
        if (worksList) {
            worksList.addEventListener('click', (e) => {
                if (e.target.classList.contains('work-link')) {
                    closeDropdown();
                }
            });
        }

        // Update dropdown position on scroll to keep it stuck to button
        if (glossaryScroll) {
            glossaryScroll.addEventListener('scroll', positionDropdown);
        }
    }
}

// ===== VIDEO HOVER CONTROLS =====
// For pages with videos that show controls on hover (omni.html)
function initVideoHoverControls() {
    const hoverVideos = document.querySelectorAll('.hover-controls');
    if (hoverVideos.length === 0) return;
    
    hoverVideos.forEach(video => {
        if (video.dataset.customControls === 'true') return;
        video.addEventListener('mouseenter', () => {
            video.setAttribute('controls', '');
        });
        
        video.addEventListener('mouseleave', () => {
            video.removeAttribute('controls');
        });
    });
}

// ===== CUSTOM MEDIA CONTROLS =====
// Replace native audio/video controls to avoid default cursor
function initCustomMediaControls() {
    const mediaElements = document.querySelectorAll('audio.audio-player[controls], video[controls], video.hover-controls');
    if (mediaElements.length === 0) return;

    mediaElements.forEach((media) => {
        if (media.dataset.customControls === 'true') return;

        media.dataset.customControls = 'true';
        media.removeAttribute('controls');

        const isVideo = media.tagName === 'VIDEO';
        const wrapper = document.createElement('div');
        wrapper.className = `media-player ${isVideo ? 'media-video' : 'media-audio'}`;

        media.parentNode.insertBefore(wrapper, media);
        wrapper.appendChild(media);

        const controls = document.createElement('div');
        controls.className = 'media-controls';

        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'media-control-button media-play';
        playBtn.setAttribute('aria-label', 'play');
        playBtn.textContent = 'play';

        const muteBtn = document.createElement('button');
        muteBtn.type = 'button';
        muteBtn.className = 'media-control-button media-mute';
        muteBtn.setAttribute('aria-label', 'mute');
        muteBtn.textContent = 'mute';

        const progress = document.createElement('input');
        progress.type = 'range';
        progress.min = '0';
        progress.max = '100';
        progress.value = '0';
        progress.className = 'media-progress';
        progress.setAttribute('aria-label', 'seek');

        const time = document.createElement('div');
        time.className = 'media-time';
        time.textContent = '0:00 / 0:00';

        controls.appendChild(playBtn);
        controls.appendChild(muteBtn);
        controls.appendChild(progress);
        controls.appendChild(time);
        wrapper.appendChild(controls);

        function formatTime(seconds) {
            if (!Number.isFinite(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        }

        function updateTime() {
            const current = media.currentTime;
            const duration = media.duration;
            time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
            if (Number.isFinite(duration) && duration > 0) {
                progress.value = ((current / duration) * 100).toString();
            }
        }

        function updatePlayButton() {
            if (media.paused) {
                playBtn.textContent = 'play';
                playBtn.setAttribute('aria-label', 'play');
            } else {
                playBtn.textContent = 'pause';
                playBtn.setAttribute('aria-label', 'pause');
            }
        }

        function updateMuteButton() {
            if (media.muted) {
                muteBtn.textContent = 'unmute';
                muteBtn.setAttribute('aria-label', 'unmute');
            } else {
                muteBtn.textContent = 'mute';
                muteBtn.setAttribute('aria-label', 'mute');
            }
        }

        playBtn.addEventListener('click', () => {
            if (media.paused) {
                media.play();
            } else {
                media.pause();
            }
        });

        muteBtn.addEventListener('click', () => {
            media.muted = !media.muted;
            updateMuteButton();
        });

        progress.addEventListener('input', () => {
            const duration = media.duration;
            if (!Number.isFinite(duration) || duration === 0) return;
            const pct = Number(progress.value) / 100;
            media.currentTime = duration * pct;
        });

        if (isVideo) {
            media.addEventListener('click', () => {
                if (media.paused) {
                    media.play();
                } else {
                    media.pause();
                }
            });
        }

        media.addEventListener('loadedmetadata', () => {
            updateTime();
            updateMuteButton();
            updatePlayButton();
        });
        media.addEventListener('timeupdate', updateTime);
        media.addEventListener('play', updatePlayButton);
        media.addEventListener('pause', updatePlayButton);
        media.addEventListener('volumechange', updateMuteButton);
        media.addEventListener('ended', updatePlayButton);
    });
}