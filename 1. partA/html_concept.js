// Add interactive click effects
document.querySelectorAll('.element-card').forEach(card => {
    card.addEventListener('click', function() {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(231, 76, 60, 0.3);
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        margin-left: -50px;
        margin-top: -50px;
    `;
    
    this.style.position = 'relative';
    this.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
    to {
        transform: scale(2);
        opacity: 0;
    }
    }
`;
document.head.appendChild(style);

// Interactive concept icon
const conceptIcon = document.querySelector('.concept-icon');
const htmlTags = ['📝', '🏷️', '<>', '{}', '#'];
let tagIndex = 0;

conceptIcon.addEventListener('click', function() {
    tagIndex = (tagIndex + 1) % htmlTags.length;
    this.innerHTML = htmlTags[tagIndex];
    this.style.animation = 'bounce 0.5s ease';
    
    setTimeout(() => {
    this.style.animation = '';
    }, 500);
});

// Add bounce animation CSS
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
    0%, 20%, 60%, 100% { transform: translateY(0) scale(1); }
    40% { transform: translateY(-10px) scale(1.1); }
    80% { transform: translateY(-5px) scale(1.05); }
    }
`;
document.head.appendChild(bounceStyle);

// Mark as read functionality
document.getElementById('markReadBtn').addEventListener('click', function() {
    this.innerHTML = '🎉 HTML Mastered! Returning to main page...';
    this.style.background = 'var(--success)';
    
    // Store completion
    try {
    const keyMap = { website: 'readWebsite', html: 'readHTML', css: 'readCSS', javascript: 'readJavaScript' };
    const k = keyMap['html'];
    if (k) localStorage.setItem(k, 'true');
    } catch (e) { }

    // Add to session disabled list
    try {
    let arr = [];
    try { arr = JSON.parse(sessionStorage.getItem('disabledLessons') || '[]'); } catch (e) { arr = []; }
    if (!Array.isArray(arr)) arr = [];
    if (arr.indexOf('html') === -1) arr.push('html');
    sessionStorage.setItem('disabledLessons', JSON.stringify(arr));
    } catch (e) { }

    setTimeout(() => {
    window.location.href = '../../index.html#before-code';
    }, 1500);
});

// Animate analogy items on scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
    }
    });
}, observerOptions);

// Initialize animations
document.querySelectorAll('.analogy-item').forEach((item, index) => {
    item.style.transform = 'translateY(30px)';
    item.style.opacity = '0.5';
    item.style.transition = 'all 0.6s ease';
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Add floating animation to HTML elements
document.querySelectorAll('.element-card').forEach((card, index) => {
    card.style.animation = `float 4s ease-in-out infinite`;
    card.style.animationDelay = `${index * 0.3}s`;
});

// CSS for floating animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
    }
`;
document.head.appendChild(floatStyle);

// Add typing effect to code demo
const codeContent = document.querySelector('.code-content');
const originalContent = codeContent.innerHTML;

function typeCode() {
    codeContent.innerHTML = '';
    let i = 0;
    const text = originalContent.replace(/<[^>]*>/g, ''); // Remove HTML for typing effect
    
    function type() {
    if (i < originalContent.length) {
        codeContent.innerHTML = originalContent.substring(0, i);
        i++;
        setTimeout(type, 50);
    }
    }
    type();
}

// Trigger typing effect when section is visible
const codeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        setTimeout(typeCode, 500);
        codeObserver.unobserve(entry.target);
    }
    });
}, { threshold: 0.5 });


codeObserver.observe(document.querySelector('.code-demo'));

